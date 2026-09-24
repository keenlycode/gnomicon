// Keep this optional network request independent of the icon gallery.
export async function loadGitHubStars(root: ParentNode): Promise<void> {
  const link = root.querySelector<HTMLAnchorElement>("#github-star");
  const count = root.querySelector<HTMLElement>("#star-count");
  if (!link || !count) return;
  try {
    const response = await fetch(
      "https://api.github.com/repos/keenlycode/gnomicon",
      { signal: AbortSignal.timeout(5000), credentials: "omit" },
    );
    if (!response.ok) throw new Error("GitHub count unavailable");
    const data = await response.json();
    const stars = data.stargazers_count;
    if (!Number.isSafeInteger(stars) || stars < 0) {
      throw new Error("Invalid GitHub count");
    }
    const label = stars.toLocaleString("en-US");
    count.textContent = label;
    link.setAttribute("aria-label", `Star Gnomicon on GitHub; ${label} stars`);
  } catch {
    // Rate limits, offline use and timeouts must not break the repository link.
    count.textContent = "—";
    link.setAttribute(
      "aria-label",
      "Star Gnomicon on GitHub; star count unavailable",
    );
  }
}
