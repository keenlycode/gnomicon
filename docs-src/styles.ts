// rem bounds respect the browser's default font size; vw adds bounded fluidity.
export const styles = String.raw`
--font-body:clamp(.9375rem,calc(.9125rem + .125vw),1rem);
--font-small:clamp(.875rem,calc(.825rem + .25vw),1rem);
--font-heading:clamp(1.25rem,calc(1.15rem + .5vw),1.5rem);
--font-title:clamp(2rem,calc(1.4rem + 3vw),3.25rem);
*{
  box-sizing:border-box}
.topbar{
  min-height:68px;
  background:#fff;
  border-bottom:1px solid #e3e9e5;
  padding:14px max(22px,calc((100vw - 1320px)/2));
  display:flex;
  flex-wrap:wrap;
  gap:14px;
  align-items:center;
  justify-content:space-between}
.brand{
  display:flex;
  align-items:center;
  gap:11px;
  text-decoration:none;
  color:inherit}
.brand strong{
  font-size:var(--font-body)}
.mark{
  width:32px;
  height:32px;
  border-radius:10px;
  background:#3584e4;
  color:white;
  display:grid;
  place-items:center;
  font-weight:800}
.version,.total{
  font-size:var(--font-small);
  color:#718078}
.topbar nav{
  display:flex;
  flex-wrap:wrap;
  gap:24px}
.topbar nav a{
  font-size:var(--font-small);
  color:#52615b;
  text-decoration:none}
main{
  max-width:1320px;
  margin:auto;
  padding:40px 28px 64px}
.intro{
  display:flex;
  align-items:end;
  justify-content:space-between;
  gap:20px;
  margin-bottom:26px}
.eyebrow{
  font-size:var(--font-small);
  font-weight:700;
  letter-spacing:.13em;
  color:#3584e4}
.intro h1{
  font-size:var(--font-title);
  letter-spacing:-.045em;
  margin:5px 0}
.intro p{
  margin:0;
  color:#65736d}
.layout{
  display:grid;
  grid-template-columns:minmax(0,2fr) minmax(400px,1fr);
  gap:18px;
  align-items:start}
.catalog,aui-card{
  background:#fff;
  border:1px solid #e2e9e5;
  border-radius:16px;
  min-width:0}
.toolbar{
  padding:15px;
  display:flex;
  gap:12px;
  align-items:end;
  border-bottom:1px solid #edf0ee}
.toolbar label,.field{
  font-size:var(--font-small);
  min-width:0;
  color:#53615b;
  display:flex;
  flex-direction:column;
  gap:5px}
.toolbar input,.toolbar select{
  min-height:40px;
  width:100%;
  min-width:0;
  border:1px solid #dce4df;
  border-radius:9px;
  background:white;
  padding:0 12px;
  color:#1d2924;
  font:inherit;
  font-size:1rem}
.search-label{
  flex:1}
.grid{
  padding:15px;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(min(100%,7.5rem),1fr));
  gap:9px;
  min-height:150px}
.tile{
  border:1px solid #edf0ee;
  border-radius:11px;
  background:white;
  min-width:0;
  padding:12px 5px 9px;
  display:grid;
  justify-items:center;
  gap:7px;
  color:#52615b;
  cursor:pointer}
.tile:hover,.tile.selected{
  border-color:#3584e4;
  background:#f3f8ff;
  color:#1c5db0}
.tile img{
  width:30px;
  height:30px}
.tile small{
  font-size:var(--font-small);
  line-height:1.4;
  overflow-wrap:anywhere;
  width:100%;
  text-align:center}
.pager{
  padding:11px 15px;
  border-top:1px solid #edf0ee;
  display:flex;
  justify-content:space-between;
  align-items:center;
  color:#65736d;
  font-size:var(--font-small);
  flex-wrap:wrap;
  gap:10px}
.pager div{
  display:flex;
  flex-wrap:wrap;
  gap:6px}
.preview-card{
  padding:19px!important}
h2,h3{
  font-size:var(--font-heading);
  line-height:1.3;
  margin:0 0 13px}
.preview{
  height:150px;
  background:#f4f7f5;
  border-radius:12px;
  margin-bottom:13px;
  display:grid;
  place-items:center;
  color:#718078}
.preview svg{
  width:var(--size,64px);
  height:var(--size,64px);
  color:var(--icon-color,#3584e4)}
#selected-name{
  font-size:var(--font-body);
  overflow-wrap:anywhere}
.field{
  margin-top:12px;
  display:grid;
  grid-template-columns:1fr auto;
  align-items:center}
.field input[type=color]{
  grid-column:2;
  grid-row:1;
  width:42px;
  height:27px;
  padding:0;
  border:0;
  background:none}
.field input[type=range]{
  grid-column:1/-1;
  width:100%;
  accent-color:#3584e4}
.snippets{
  border-top:1px solid #edf0ee;
  margin-top:14px;
  padding-top:12px;
  display:grid;
  grid-template-columns:minmax(0,1fr);
  align-items:center;
  gap:8px}
.snippets aui-button{
  justify-self:start}
.code-label{
  font-size:var(--font-small);
  color:#65736d;
  grid-column:1/-1}
.snippets pre,.example{
  margin:0 0 7px;
  background:#192823;
  color:#e0ece6;
  border-radius:8px;
  padding:9px;
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  font:var(--font-small)/1.5 ui-monospace,monospace}
.source-code{
  min-width:0;
  font-size:var(--font-small)}
.source-code summary{
  cursor:pointer;
  color:#1764ad;
  margin-bottom:8px}
.availability{
  margin:4px 0;
  font-size:var(--font-small);
  color:#65736d}
.info-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:16px;
  margin-top:32px}
#guide-title{
  grid-column:1/-1;
  margin:0}
.info-grid article{
  min-width:0;
  background:white;
  border:1px solid #e2e9e5;
  border-radius:14px;
  padding:22px}
.info-grid p,.info-grid li{
  font-size:var(--font-body);
  color:#65736d}
.info-grid code{
  font-size:var(--font-small);
  overflow-wrap:anywhere;
  background:#f0f4f1;
  padding:2px 4px;
  border-radius:4px}
.info-grid a,footer a{
  color:#1764ad}
.release-notice{
  border-left:3px solid #3584e4;
  padding-left:12px}
footer{
  padding:23px 0;
  color:#65736d;
  font-size:var(--font-small);
  overflow-wrap:anywhere}
footer summary{
  cursor:pointer;
  color:#1764ad;
  font-weight:600}
.license-notes{
  max-width:80ch;
  font-size:var(--font-body)}
aui-button{
  font-size:var(--font-small)}
#copy-status{
  font-size:var(--font-small)}
@media(max-width:980px){
  .layout{
  grid-template-columns:1fr}
}
@media(max-width:640px){
  main{
  padding:28px 14px 48px}
.topbar{
  padding:14px}
.topbar nav{
  gap:12px}
.intro{
  display:block}
.total{
  margin-top:12px}
.grid{
  padding:9px;
  gap:6px}
.toolbar{
  align-items:stretch;
  flex-direction:column}
.info-grid{
  grid-template-columns:1fr}
.pager{
  align-items:flex-start;
  gap:8px}
.preview-card{
  padding:14px!important}
}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{
  outline:3px solid #78aaf0;
  outline-offset:2px}


`;
