import { Base, Button, Card, html, reactive } from "./vendor/adaptive-ui.js";
import { styles } from "./styles.ts";

type Icon = {
  name: string;
  exportName: string;
  source: string;
  sourcePath: string;
  svg: string;
};
type Source = {
  id: string;
  repository: string;
  revision: string;
  license: string;
};
type Manifest = { version: string; icons: Icon[]; sources: Source[] };
type CatalogState = {
  version: string;
  icons: Icon[];
  sources: Source[];
  query: string;
  source: string;
  selected: string;
  page: number;
  color: string;
  size: number;
};
const PAGE_SIZE = 96;

if (!customElements.get("aui-button")) Button.define("aui-button");
if (!customElements.get("aui-card")) Card.define("aui-card");

class GnomiconApp extends Base {
  #state: CatalogState = reactive({
    version: "51.0.0",
    icons: [],
    sources: [],
    query: "",
    source: "all",
    selected: "",
    page: 0,
    color: "#3584e4",
    size: 64,
  });
  #svgText = "";
  #previewRequest = 0;

  static {
    this.css =
      `display:block;color:#1d2924;font:15px/1.55 Inter,ui-sans-serif,system-ui,sans-serif;background:#f5f7f6;min-height:100vh;${styles}`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.append(
      ...Array.from(document.body.children).filter((child) =>
        child !== (this as unknown as Element)
      ),
    );
    this.bindEvents();
    const total = this.querySelector("#total")!;
    total.replaceChildren();
    html`
      ${() => this.#state.icons.length.toLocaleString()} icons · v${() =>
        this.#state.version}
    `(total);
    fetch("./lib/gnomicon/icons.json").then((response) => {
      if (!response.ok) {
        throw new Error(`Catalog load failed (${response.status})`);
      }
      return response.json() as Promise<Manifest>;
    }).then((manifest) => {
      this.#state.version = manifest.version;
      this.#state.icons = manifest.icons;
      this.#state.sources = manifest.sources;
      this.#state.selected = manifest.icons[0]?.name ?? "";
      this.renderSources();
      this.renderGrid();
      this.renderPreview();
    }).catch((error: unknown) => {
      this.text("total", "Catalog unavailable");
      this.text(
        "grid",
        error instanceof Error ? error.message : "Could not load icon catalog.",
      );
    });
  }

  #allFiltered() {
    const query = this.#state.query.toLocaleLowerCase();
    return this.#state.icons.filter((icon) =>
      icon.name.toLocaleLowerCase().includes(query) &&
      (this.#state.source === "all" || icon.source === this.#state.source)
    );
  }

  private text(id: string, value: string) {
    const node = this.querySelector(`#${id}`);
    if (node) node.textContent = value;
  }
  private selected() {
    return this.#state.icons.find((icon) => icon.name === this.#state.selected);
  }

  private renderSources() {
    const select = (this.querySelector("#source") as HTMLSelectElement)!;
    for (const source of this.#state.sources) {
      const option = document.createElement("option");
      option.value = source.id;
      option.textContent = source.id;
      select.append(option);
    }
    const list = (this.querySelector("#source-list") as HTMLUListElement)!;
    for (const source of this.#state.sources) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = source.repository;
      link.textContent = source.id;
      item.append(
        link,
        document.createTextNode(
          ` · ${source.license} · ${source.revision.slice(0, 12)}`,
        ),
      );
      list.append(item);
    }
  }

  private renderGrid() {
    const filtered = this.#allFiltered();
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    this.#state.page = Math.min(Math.max(this.#state.page, 0), pages - 1);
    const shown = filtered.slice(
      this.#state.page * PAGE_SIZE,
      (this.#state.page + 1) * PAGE_SIZE,
    );
    const grid = (this.querySelector("#grid") as HTMLElement)!;
    const fragment = document.createDocumentFragment();
    for (const icon of shown) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tile${
        icon.name === this.#state.selected ? " selected" : ""
      }`;
      button.dataset.icon = icon.name;
      button.setAttribute(
        "aria-pressed",
        String(icon.name === this.#state.selected),
      );
      button.setAttribute("aria-label", `Preview ${icon.name}`);
      const image = document.createElement("img");
      image.src = `./lib/gnomicon/${icon.svg}`;
      image.alt = "";
      image.loading = "lazy";
      const label = document.createElement("small");
      label.textContent = icon.name;
      button.append(image, label);
      fragment.append(button);
    }
    grid.replaceChildren(fragment);
    this.text(
      "range",
      `Showing ${filtered.length ? this.#state.page * PAGE_SIZE + 1 : 0}–${
        Math.min((this.#state.page + 1) * PAGE_SIZE, filtered.length)
      } of ${filtered.length}`,
    );
    (this.querySelector("#prev button") as HTMLButtonElement)!.disabled =
      this.#state.page === 0;
    (this.querySelector("#next button") as HTMLButtonElement)!.disabled =
      this.#state.page >= pages - 1;
  }

  private async renderPreview() {
    const icon = this.selected();
    const preview = (this.querySelector("#preview") as HTMLElement)!;
    const request = ++this.#previewRequest;
    if (!icon) {
      preview.replaceChildren(document.createTextNode("No matching icons"));
      this.text("selected-name", "No icon selected");
      return;
    }
    this.text("selected-name", icon.name);
    preview.setAttribute("aria-label", `${icon.name} icon preview`);
    preview.style.setProperty("--size", `${this.#state.size}px`);
    preview.style.setProperty("--icon-color", this.#state.color);
    this.#svgText = "";
    try {
      const url = new URL(`./lib/gnomicon/${icon.svg}`, location.href);
      const response = await fetch(url);
      if (!response.ok) {
        if (request === this.#previewRequest) {
          preview.replaceChildren(
            document.createTextNode("SVG preview unavailable"),
          );
        }
        return;
      }
      const svgText = await response.text();
      if (request !== this.#previewRequest) return;
      preview.style.setProperty("--icon-color", this.#state.color);
      this.#svgText = svgText;
      const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
      const svg = parsed.documentElement;
      if (svg.localName !== "svg" || parsed.querySelector("parsererror")) {
        preview.replaceChildren(document.createTextNode("Invalid SVG asset"));
        return;
      }
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", `${icon.name} icon`);
      preview.replaceChildren(document.importNode(svg, true));
      this.updateSnippets(icon);
    } catch {
      if (request === this.#previewRequest) {
        preview.textContent = "SVG preview unavailable";
      }
    }
  }

  private updateSnippets(icon: Icon) {
    const npm = `import { ${icon.exportName} } from 'gnomicon';`;
    const jsr =
      `import { ${icon.exportName} } from 'jsr:@your-scope/gnomicon';`;
    const svg = new DOMParser().parseFromString(this.#svgText, "image/svg+xml")
      .documentElement;
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", icon.name);
    svg.style.color = "currentColor";
    const html = new XMLSerializer().serializeToString(svg);
    for (
      const [id, value] of [["npm-code", npm], ["jsr-code", jsr], [
        "html-code",
        html,
      ]] as const
    ) this.text(id, value);
    (this.querySelector("#copy-npm") as HTMLElement)!.dataset.copy = npm;
    (this.querySelector("#copy-jsr") as HTMLElement)!.dataset.copy = jsr;
    (this.querySelector("#copy-html") as HTMLElement)!.dataset.copy = html;
  }

  private async copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      this.text("copy-status", "Copied to clipboard");
    } catch {
      this.text(
        "copy-status",
        "Copy unavailable. Select the snippet to copy manually.",
      );
    }
  }

  private bindEvents() {
    (this.querySelector("#search") as HTMLInputElement)!.addEventListener(
      "input",
      (event) => {
        this.#state.query = (event.currentTarget as HTMLInputElement).value;
        this.#state.page = 0;
        this.renderGrid();
      },
    );
    (this.querySelector("#source") as HTMLSelectElement)!.addEventListener(
      "change",
      (event) => {
        this.#state.source = (event.currentTarget as HTMLSelectElement).value;
        this.#state.page = 0;
        this.renderGrid();
      },
    );
    (this.querySelector("#grid") as HTMLElement)!.addEventListener(
      "click",
      (event) => {
        const button = (event.target as Element).closest<HTMLButtonElement>(
          "button[data-icon]",
        );
        if (!button) return;
        this.#state.selected = button.dataset.icon!;
        (this.querySelectorAll(".tile") as NodeListOf<HTMLElement>).forEach(
          (tile) => {
            const active = tile === button;
            tile.classList.toggle("selected", active);
            tile.setAttribute("aria-pressed", String(active));
          },
        );
        void this.renderPreview();
      },
    );
    this.querySelector("#prev")!.addEventListener("click", () => {
      this.#state.page--;
      this.renderGrid();
    });
    this.querySelector("#next")!.addEventListener("click", () => {
      this.#state.page++;
      this.renderGrid();
    });
    (this.querySelector("#color") as HTMLInputElement)!.addEventListener(
      "input",
      (event) => {
        this.#state.color = (event.currentTarget as HTMLInputElement).value;
        const preview = this.querySelector("#preview")!;
        preview.style.setProperty("--icon-color", this.#state.color);
        preview.style.color = this.#state.color;
      },
    );
    (this.querySelector("#size") as HTMLInputElement)!.addEventListener(
      "input",
      (event) => {
        this.#state.size = Number(
          (event.currentTarget as HTMLInputElement).value,
        );
        this.text("size-label", `${this.#state.size} px`);
        this.querySelector("#preview")!.style.setProperty(
          "--size",
          `${this.#state.size}px`,
        );
      },
    );
    (this.querySelectorAll("#copy-npm, #copy-jsr, #copy-html") as NodeListOf<
      HTMLElement
    >).forEach((
      button,
    ) =>
      button.addEventListener(
        "click",
        () => void this.copy(button.dataset.copy ?? ""),
      )
    );
    this.querySelector("#copy-svg")!.addEventListener(
      "click",
      () => void this.copy(this.#svgText),
    );
  }
}
GnomiconApp.define("gnomicon-app");
document.body.append(document.createElement("gnomicon-app"));
