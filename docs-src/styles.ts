export const styles = String.raw`
*{
  box-sizing:border-box}
.topbar{
  height:68px;
  background:#fff;
  border-bottom:1px solid #e3e9e5;
  padding:0 max(22px,calc((100vw - 1320px)/2));
  display:flex;
  align-items:center;
  justify-content:space-between}
.brand{
  display:flex;
  align-items:center;
  gap:11px;
  text-decoration:none;
  color:inherit}
.brand strong{
  font-size:17px}
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
  font-size:12px;
  color:#718078}
.topbar nav{
  display:flex;
  gap:24px}
.topbar nav a{
  font-size:13px;
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
  margin-bottom:26px}
.eyebrow{
  font-size:11px;
  font-weight:700;
  letter-spacing:.13em;
  color:#3584e4}
.intro h1{
  font-size:clamp(36px,4vw,52px);
  letter-spacing:-.045em;
  margin:5px 0}
.intro p{
  margin:0;
  color:#65736d}
.layout{
  display:grid;
  grid-template-columns:minmax(0,1fr) 340px;
  gap:18px;
  align-items:start}
.catalog,aui-card{
  background:#fff;
  border:1px solid #e2e9e5;
  border-radius:16px;
  overflow:hidden}
.toolbar{
  padding:15px;
  display:flex;
  gap:12px;
  align-items:end;
  border-bottom:1px solid #edf0ee}
.toolbar label,.field{
  font-size:12px;
  color:#53615b;
  display:flex;
  flex-direction:column;
  gap:5px}
.toolbar input,.toolbar select{
  height:40px;
  border:1px solid #dce4df;
  border-radius:9px;
  background:white;
  padding:0 12px;
  color:#1d2924;
  font:inherit}
.search-label{
  flex:1}
.grid{
  padding:15px;
  display:grid;
  grid-template-columns:repeat(6,minmax(0,1fr));
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
  font-size:10px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  width:100%;
  text-align:center}
.pager{
  padding:11px 15px;
  border-top:1px solid #edf0ee;
  display:flex;
  justify-content:space-between;
  align-items:center;
  color:#65736d;
  font-size:12px}
.pager div{
  display:flex;
  gap:6px}
.preview-card{
  padding:19px!important;
  position:sticky;
  top:14px}
h2{
  font-size:17px;
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
  font-size:14px}
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
  grid-template-columns:1fr auto;
  align-items:center;
  gap:5px}
.code-label{
  font-size:10px;
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
  font:10px/1.5 ui-monospace,monospace;
  max-height:90px;
  overflow:auto}
.info-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
  margin-top:27px}
.info-grid article{
  background:white;
  border:1px solid #e2e9e5;
  border-radius:14px;
  padding:22px}
.info-grid p,.info-grid li{
  font-size:13px;
  color:#65736d}
.info-grid code{
  background:#f0f4f1;
  padding:2px 4px;
  border-radius:4px}
.info-grid a{
  color:#1764ad}
footer{
  padding:23px 0;
  color:#7a8580;
  font-size:11px}
aui-button{
  font-size:11px}
@media(max-width:980px){
  .layout{
  grid-template-columns:1fr}
.preview-card{
  position:static}
.grid{
  grid-template-columns:repeat(6,minmax(0,1fr))}
}
@media(max-width:640px){
  main{
  padding:28px 14px 48px}
.topbar{
  padding:0 14px}
.topbar nav{
  gap:12px}
.intro{
  display:block}
.total{
  margin-top:12px}
.grid{
  grid-template-columns:repeat(4,minmax(0,1fr));
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
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible{
  outline:3px solid #78aaf0;
  outline-offset:2px}


`;
