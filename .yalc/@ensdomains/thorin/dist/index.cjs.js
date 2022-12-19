"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});var Be=require("react"),o=require("styled-components"),tr=require("react-dom"),rr=require("react-transition-state");function jn(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}function nr(e){if(e&&e.__esModule)return e;var t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});return e&&Object.keys(e).forEach(function(n){if(n!=="default"){var a=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,a.get?a:{enumerable:!0,get:function(){return e[n]}})}}),t.default=e,Object.freeze(t)}var r=nr(Be),u=jn(o),On=nr(tr);const Fn=u.default.div(({theme:e,$shape:t,$noBorder:n})=>o.css`
    ${()=>{switch(t){case"circle":return o.css`
            border-radius: ${e.radii.full};
            &:after {
              border-radius: ${e.radii.full};
            }
          `;case"square":return o.css`
          border-radius: ${e.radii["2xLarge"]}
          &:after {
            border-radius: ${e.radii["2xLarge"]}
          }
        `;default:return o.css``}}}

    ${!n&&o.css`
      &::after {
        box-shadow: ${e.shadows["-px"]} ${e.colors.foregroundTertiary};
        content: '';
        inset: 0;
        position: absolute;
      }
    `}

    background-color: ${e.colors.foregroundSecondary};

    width: 100%;
    padding-bottom: 100%;

    > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    overflow: hidden;
    position: relative;
  `),Dn=u.default.div(({theme:e,$url:t,$disabled:n})=>o.css`
    background: ${t||e.colors.gradients.blue};

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    ${n&&o.css`
      filter: grayscale(1);
    `}
  `),An=u.default.img(({$shown:e,$disabled:t})=>o.css`
    height: 100%;
    width: 100%;
    object-fit: cover;
    display: none;

    ${e&&o.css`
      display: block;
    `}

    ${t&&o.css`
      filter: grayscale(1);
    `}
  `),ze=({label:e,noBorder:t=!1,shape:n="circle",src:a,placeholder:s,decoding:i="async",disabled:l=!1,...c})=>{const d=r.useRef(null),[f,m]=r.useState(!!a),b=r.useCallback(()=>{m(!0)},[m]),$=r.useCallback(()=>{m(!1)},[m]);return r.useEffect(()=>{const p=d.current;return p&&(p.addEventListener("load",b),p.addEventListener("loadstart",$),p.addEventListener("error",$)),()=>{p&&(p.removeEventListener("load",b),p.removeEventListener("loadstart",$),p.removeEventListener("error",$))}},[d,$,b]),r.createElement(Fn,{$noBorder:!f||t,$shape:n},!f&&r.createElement(Dn,{$disabled:l,$url:s,"aria-label":e}),r.createElement(An,{...c,$disabled:l,$shown:f,alt:e,decoding:i,ref:d,src:a,onError:()=>m(!1),onLoad:()=>m(!0)}))};ze.displayName="Avatar";const Qe=u.default.div(({theme:e,$state:t,$empty:n})=>o.css`
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
    z-index: 999;
    top: 0;
    left: 0;
    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${!n&&t==="entered"?o.css`
          background-color: rgba(
            0,
            0,
            0,
            ${e.shades.backgroundHideFallback}
          );

          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(16px);
            background-color: ${e.colors.backgroundHide};
          }
        `:o.css`
          background-color: rgba(0, 0, 0, 0);
          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(0px);
          }
        `}
  `),or={none:"none",solid:"solid"},ar={0:"0px",px:"1px","0.375":"0.09375rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem"},sr={none:"0",medium:"6px",large:"8px",almostExtraLarge:"10px",extraLarge:"12px","2xLarge":"16px","2.5xLarge":"20px","3xLarge":"24px","4xLarge":"40px",full:"9999px"},N={none:"none","-px":"inset 0 0 0 1px",0:"0 0 0 0","0.02":"0 2px 8px","0.25":"0 2px 12px","0.5":"0 0 0 0.125rem",1:"0 0 0 0.25rem",2:"0 0 0 0.5rem"},G={light:{blue:"82, 152, 255",lightBlue:"238, 245, 255",green:"73, 179, 147",indigo:"88, 84, 214",orange:"255, 149, 0",pink:"255, 45, 85",purple:"175, 82, 222",red:"213, 85, 85",lightRed:"249, 231, 231",teal:"90, 200, 250",yellow:"255, 204, 0",lightYellow:"255, 248, 219",grey:"232, 232, 235"},dark:{blue:"82, 152, 255",lightBlue:"238, 245, 255",green:"73, 179, 147",indigo:"94, 92, 230",orange:"255, 159, 10",pink:"255, 55, 95",purple:"191, 90, 242",red:"213, 85, 85",lightRed:"249, 231, 231",teal:"100, 210, 255",yellow:"255, 214, 10",lightYellow:"255, 248, 219",grey:"59, 59, 61"}},Te={light:{blue:`rgb(${G.light.blue})`,lightBlue:`rgb(${G.light.lightBlue})`,green:`rgb(${G.light.green})`,indigo:`rgb(${G.light.indigo})`,orange:`rgb(${G.light.orange})`,pink:`rgb(${G.light.pink})`,purple:`rgb(${G.light.purple})`,red:`rgb(${G.light.red})`,lightRed:`rgb(${G.light.lightRed})`,teal:`rgb(${G.light.teal})`,yellow:`rgb(${G.light.yellow})`,lightYellow:`rgb(${G.light.lightYellow})`,grey:`rgb(${G.light.grey})`},dark:{blue:`rgb(${G.dark.blue})`,lightBlue:`rgb(${G.dark.lightBlue})`,green:`rgb(${G.dark.green})`,indigo:`rgb(${G.dark.indigo})`,orange:`rgb(${G.dark.orange})`,pink:`rgb(${G.dark.pink})`,purple:`rgb(${G.dark.purple})`,red:`rgb(${G.dark.red})`,lightRed:`rgb(${G.dark.lightRed})`,teal:`rgb(${G.dark.teal})`,yellow:`rgb(${G.dark.yellow})`,lightYellow:`rgb(${G.dark.lightYellow})`,grey:`rgb(${G.dark.grey})`}},V={light:{background:"255, 255, 255",backgroundSecondary:"246, 246, 248",backgroundTertiary:"246, 246, 248",foreground:"0, 0, 0",groupBackground:"253, 253, 253"},dark:{background:"20, 20, 20",backgroundSecondary:"10, 10, 10",backgroundTertiary:"20, 20, 20",foreground:"255, 255, 255",groupBackground:"10, 10, 10"}},Me={light:{blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)"},dark:{blue:"linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",green:"linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",red:"linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)"}},H={light:{accent:"0.7",accentSecondary:"0.15",accentSecondaryHover:"0.2",backgroundHide:"0.1",backgroundHideFallback:"0.5",foregroundSecondary:"0.05",foregroundSecondaryHover:"0.035",foregroundTertiary:"0.033",groupBorder:"0.075",border:"0.3",borderSecondary:"0.12",borderTertiary:"0.05",text:"0.8",textSecondary:"0.65",textSecondaryHover:"0.7",textTertiary:"0.4",textTertiaryHover:"0.5",textPlaceholder:"0.25"},dark:{accent:"0.66",accentSecondary:"0.2",accentSecondaryHover:"0.25",backgroundHide:"0.1",backgroundHideFallback:"0.5",foregroundSecondary:"0.1",foregroundSecondaryHover:"0.15",foregroundTertiary:"0.04",groupBorder:"0",border:"0.3",borderSecondary:"0.12",borderTertiary:"0.05",text:"0.7",textSecondary:"0.5",textSecondaryHover:"0.65",textTertiary:"0.35",textTertiaryHover:"0.4",textPlaceholder:"0.25"}},I={base:{black:"rgb(0, 0, 0)",white:"rgb(255, 255, 255)",current:"currentColor",inherit:"inherit",transparent:"transparent"},light:{accent:`${Te.light.blue}`,accentSecondary:`rgba(${G.light.blue}, ${H.light.accentSecondary})`,accentSecondaryHover:`rgba(${G.light.blue}, ${H.light.accentSecondary})`,accentTertiary:`rgba(${G.light.blue}, calc(${H.light.accentSecondary} * 0.5))`,accentText:`rgb(${V.light.background})`,accentGradient:Me.light.blue,background:`rgb(${V.light.background})`,backgroundHide:`rgba(${V.light.foreground}, ${H.light.backgroundHide})`,backgroundSecondary:`rgb(${V.light.backgroundSecondary})`,backgroundTertiary:`rgb(${V.light.backgroundTertiary})`,border:`rgb(${V.light.foreground}, ${H.light.border})`,borderSecondary:`rgb(${V.light.foreground}, ${H.light.borderSecondary})`,borderTertiary:`rgb(${V.light.foreground}, ${H.light.borderTertiary})`,foreground:`rgb(${V.light.foreground})`,foregroundSecondary:`rgba(${V.light.foreground}, ${H.light.foregroundSecondary})`,foregroundSecondaryHover:`rgba(${V.light.foreground}, ${H.light.foregroundSecondaryHover})`,foregroundTertiary:`rgba(${V.light.foreground}, ${H.light.foregroundTertiary})`,groupBackground:`rgb(${V.light.groupBackground})`,groupBorder:`rgb(${V.light.foreground})`,gradients:Me.light,text:`rgb(${V.light.foreground}, ${H.light.text})`,textPlaceholder:`rgb(${V.light.foreground}, ${H.light.textPlaceholder})`,textSecondary:`rgb(${V.light.foreground}, ${H.light.textSecondary})`,textTertiary:`rgb(${V.light.foreground}, ${H.light.textTertiary})`,...Te.light},dark:{accent:`${Te.dark.blue}`,accentSecondary:`rgba(${G.dark.blue}, ${H.dark.accentSecondary})`,accentSecondaryHover:`rgba(${G.dark.blue}, ${H.dark.accentSecondary})`,accentTertiary:`rgba(${G.dark.blue}, calc(${H.dark.accentSecondary} * 0.5))`,accentText:`rgb(${V.dark.background})`,accentGradient:Me.dark.blue,background:`rgb(${V.dark.background})`,backgroundHide:`rgba(${V.dark.foreground}, ${H.dark.backgroundHide})`,backgroundSecondary:`rgb(${V.dark.backgroundSecondary})`,backgroundTertiary:`rgb(${V.dark.backgroundTertiary})`,border:`rgb(${V.dark.foreground}, ${H.dark.border})`,borderSecondary:`rgb(${V.dark.foreground}, ${H.dark.borderSecondary})`,borderTertiary:`rgb(${V.dark.foreground}, ${H.dark.borderTertiary})`,foreground:`rgb(${V.dark.foreground})`,foregroundSecondary:`rgba(${V.dark.foreground}, ${H.dark.foregroundSecondary})`,foregroundSecondaryHover:`rgba(${V.dark.foreground}, ${H.dark.foregroundSecondaryHover})`,foregroundTertiary:`rgba(${V.dark.foreground}, ${H.dark.foregroundTertiary})`,groupBackground:`rgb(${V.dark.groupBackground})`,groupBorder:`rgb(${V.dark.foreground})`,gradients:Me.dark,text:`rgb(${V.dark.foreground}, ${H.dark.text})`,textPlaceholder:`rgb(${V.dark.foreground}, ${H.dark.textPlaceholder})`,textSecondary:`rgb(${V.dark.foreground}, ${H.dark.textSecondary})`,textTertiary:`rgb(${V.dark.foreground}, ${H.dark.textTertiary})`,...Te.dark}},ir={0:"0",30:".3",50:".5",70:".7",100:"1"},lr={0:"0",px:"1px","0.25":"0.0625rem","0.5":"0.125rem","0.75":"0.1875rem",1:"0.25rem","1.25":"0.3125rem","1.5":"0.375rem","1.75":"0.4375rem",2:"0.5rem","2.5":"0.625rem",3:"0.75rem","3.5":"0.875rem",4:"1rem","4.5":"1.125rem",5:"1.25rem","5.5":"1.375rem",6:"1.5rem",7:"1.75rem",8:"2rem",9:"2.25rem",10:"2.5rem",11:"2.75rem",12:"3rem",13:"3.25rem",14:"3.5rem",15:"3.75rem",16:"4rem",18:"4.5rem",20:"5rem",24:"6rem",28:"7rem",32:"8rem",36:"9rem",40:"10rem",44:"11rem",48:"12rem",52:"13rem",56:"14rem",60:"15rem",64:"16rem",72:"18rem",80:"20rem",96:"24rem",112:"28rem",128:"32rem",144:"36rem",168:"42rem",192:"48rem",224:"56rem",256:"64rem",288:"72rem",320:"80rem","1/4":"25%","1/3":"33.333333%","1/2":"50%","2/3":"66.666667%","3/4":"75%",auto:"auto",full:"100%",fit:"fit-content",max:"max-content",min:"min-content",viewHeight:"100vh",viewWidth:"100vw",none:"0"},cr={mono:'"iAWriter Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',sans:'"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'},dr={headingOne:"3rem",headingTwo:"1.875rem",headingThree:"1.625rem",extraLarge:"1.3125rem",large:"1.125rem",small:"0.9375rem",label:"0.8125rem",base:"1.0625rem",root:"16px"},ur={light:"300",normal:"400",medium:"500",semiBold:"550",bold:"650"},gr={"-0.02":"-0.02em","-0.015":"-0.015em","-0.01":"-0.01em",normal:"0","0.03":"0.03em"},fr={normal:"normal",none:"1","1.25":"1.25","1.375":"1.375","1.5":"1.5","1.625":"1.625",2:"2"},pr={75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},br={linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)",inOut:"cubic-bezier(0.42, 0, 0.58, 1)",popIn:"cubic-bezier(0.15, 1.15, 0.6, 1)"},He={xs:360,sm:640,md:768,lg:1024,xl:1280},Zn={light:{0:`${N[0]} ${I.light.foregroundSecondary}`,"0.02":`${N["0.02"]} ${I.light.foregroundSecondary}`,"0.25":`${N["0.25"]} ${I.light.foregroundSecondary}`,"0.5":`${N["0.5"]} ${I.light.foregroundSecondary}`,1:`${N[1]} ${I.light.foregroundSecondary}`},dark:{0:`${N[0]} ${I.dark.foregroundSecondary}`,"0.02":`${N["0.02"]} ${I.dark.foregroundSecondary}`,"0.25":`${N["0.25"]} ${I.dark.foregroundSecondary}`,"0.5":`${N["0.5"]} ${I.dark.foregroundSecondary}`,1:`${N[1]} ${I.dark.foregroundSecondary}`}},_={borderStyles:or,borderWidths:ar,colors:I,fonts:cr,fontSizes:dr,fontWeights:ur,letterSpacings:gr,lineHeights:fr,opacity:ir,radii:sr,shades:H,shadows:N,space:lr,breakpoints:He,transitionDuration:pr,transitionTimingFunction:br,boxShadows:Zn,accentsRaw:G,shadesRaw:V},Pe={borderStyles:or,borderWidths:ar,colors:I.base,fonts:cr,fontSizes:dr,fontWeights:ur,letterSpacings:gr,lineHeights:fr,opacity:ir,radii:sr,shadows:N,space:lr,breakpoints:He,transitionDuration:pr,transitionTimingFunction:br},Wn={...Pe,colors:{...Pe.colors,..._.colors.light},shades:_.shades.light,boxShadows:_.boxShadows.light,accentsRaw:_.accentsRaw.light,shadesRaw:_.shadesRaw.light,mode:"light"},Nn={..._,colors:{...Pe.colors,..._.colors.dark},shades:_.shades.dark,boxShadows:_.boxShadows.dark,accentsRaw:_.accentsRaw.dark,shadesRaw:_.shadesRaw.dark,mode:"dark"},$r={min:"min-width",max:"max-width"},In=Object.keys(He),_n=Object.keys($r),U=In.reduce((e,t)=>(e[t]=_n.reduce((n,a)=>(n[a]=s=>o.css`
        @media (${$r[a]}: ${He[t]}px) {
          ${s};
        }
      `,n),{}),e),{}),J=u.default.div(()=>o.css`
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `),Un=o.keyframes`
  100% {
    transform: rotate(1turn);
  }
`,Yn=u.default.div(({theme:e,$color:t,$size:n})=>o.css`
    animation: ${Un} 1.1s linear infinite;

    color: ${e.colors[t]};
    stroke: ${e.colors[t]};

    ${()=>{switch(n){case"small":return o.css`
            height: ${e.space[6]};
            stroke-width: ${e.space["1.25"]};
            width: ${e.space[6]};
          `;case"large":return o.css`
            height: ${e.space[16]};
            stroke-width: ${e.space[1]};
            width: ${e.space[16]};
          `;default:return""}}}
  `),ye=r.forwardRef(({accessibilityLabel:e,size:t="small",color:n="text",...a},s)=>r.createElement(Yn,{$color:n,$size:t,ref:s,...a},e&&r.createElement(J,null,e),r.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},r.createElement("circle",{cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:"42",strokeLinecap:"round"}),r.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:"0.25",r:"9",strokeLinecap:"round"}))));ye.displayName="Spinner";const qn=u.default.div(({theme:e,$ellipsis:t,$variant:n,$size:a,$color:s,$weight:i,$font:l})=>o.css`
    font-family: ${e.fonts[l]};
    letter-spacing: ${e.letterSpacings["-0.01"]};
    letter-spacing: ${e.letterSpacings["-0.015"]};
    line-height: ${e.lineHeights.normal};

    ${t&&o.css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}

    ${()=>{switch(n){case"small":return o.css`
            font-size: ${e.fontSizes.small};
            font-weight: ${e.fontWeights.normal};
            letter-spacing: ${e.letterSpacings["-0.01"]};
            line-height: ${e.lineHeights.normal};
          `;case"large":return o.css`
            font-size: ${e.fontSizes.large};
            font-weight: ${e.fontWeights.normal};
            letter-spacing: ${e.letterSpacings["-0.02"]};
            line-height: ${e.lineHeights[2]};
          `;case"extraLarge":return o.css`
            font-size: ${e.fontSizes.extraLarge};
            font-weight: ${e.fontWeights.medium};
            letter-spacing: ${e.letterSpacings["-0.02"]};
            line-height: ${e.lineHeights[2]};
          `;case"label":return o.css`
            color: ${e.colors.text};
            font-size: ${e.fontSizes.label};
            font-weight: ${e.fontWeights.bold};
            letter-spacing: ${e.letterSpacings["-0.01"]};
            text-transform: capitalize;
          `;case"labelHeading":return o.css`
            color: ${e.colors.text};
            font-size: ${e.fontSizes.small};
            font-weight: ${e.fontWeights.bold};
            letter-spacing: ${e.letterSpacings["-0.01"]};
            text-transform: capitalize;
          `;default:return""}}}

  ${s&&o.css`
      color: ${e.colors[s]};
    `}

  ${a&&o.css`
      font-size: ${e.fontSizes[a]};
    `}

  ${i&&o.css`
      font-weight: ${e.fontWeights[i]};
    `}
  `),K=r.forwardRef(({as:e="div",children:t,ellipsis:n,variant:a,className:s,weight:i,font:l="sans",color:c,size:d,...f},m)=>r.createElement(qn,{...f,$color:c,$ellipsis:n?!0:void 0,$font:l,$size:d,$variant:a,$weight:i,as:e,className:s,ref:m},t));K.displayName="Typography";const Xn=({center:e,size:t,side:n,theme:a})=>e&&o.css`
    position: absolute;
    ${n}: ${t==="medium"?a.space[4]:a.space[5]};
  `,pe=(e,t,n,a)=>{if(t==="accent")return e.colors[n];if(t==="grey")switch(n){case"accentText":return e.colors.text;case"accentSecondary":return e.colors.foregroundTertiary;default:return a==="secondary"?e.colors.textSecondary:e.colors[t]}switch(n){case"accent":return e.colors[t];case"accentText":return e.colors.white;case"accentGradient":return e.colors.gradients[t];case"accentSecondary":return`rgba(${e.accentsRaw[t]}, ${e.shades[n]})`;case"accentSecondaryHover":return`rgba(${e.accentsRaw[t]}, ${e.shades[n]})`;default:return""}},Kn=u.default.button(({theme:e,disabled:t,$center:n,$pressed:a,$shadowless:s,$outlined:i,$size:l,$variant:c,$tone:d,$shape:f,$psuedoDisabled:m})=>o.css`
    position: relative;
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    transition-property: all;

    gap: ${e.space[4]};
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    letter-spacing: ${e.letterSpacings["-0.01"]};
    width: 100%;

    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    &:active {
      transform: translateY(0px);
      filter: brightness(1);
    }

    ${t?o.css`
          cursor: not-allowed;
        `:""};
    ${n?o.css`
          position: relative;
        `:""};
    ${a?o.css`
          filter: brightness(0.95);
        `:""};
    ${s?o.css`
          box-shadow: none !important;
        `:""};

    ${i?o.css`
          border: ${e.borderWidths.px} ${e.borderStyles.solid}
            ${e.colors.borderTertiary};
        `:""}

    box-shadow: ${e.shadows["0.25"]} ${e.colors.grey};

    border-radius: ${e.radii.extraLarge};
    font-size: ${e.fontSizes.large};
    padding: ${e.space["3.5"]} ${e.space[4]};

    ${()=>{switch(l){case"extraSmall":return o.css`
            border-radius: ${e.radii.large};
            font-size: ${e.fontSizes.small};
            padding: ${e.space[2]};
          `;case"small":return o.css`
            border-radius: ${e.radii.large};
            font-size: ${e.fontSizes.small};
            height: ${e.space[10]};
            padding: 0 ${e.space[4]};
          `;case"medium":return"";default:return""}}}

    ${()=>{switch(c){case"primary":return o.css`
            color: ${pe(e,d,"accentText")};
            background: ${pe(e,d,"accent")};
          `;case"secondary":return o.css`
            color: ${pe(e,d,"accent","secondary")};
            background: ${pe(e,d,"accentSecondary")};
          `;case"action":return o.css`
            color: ${pe(e,d,"accentText")};
            background: ${pe(e,d,"accentGradient")};
          `;case"transparent":return o.css`
            color: ${e.colors.textTertiary};

            &:hover {
              background-color: ${e.colors.foregroundTertiary};
            }

            &:active {
              background-color: ${e.colors.foregroundTertiary};
            }
          `;default:return""}}}
    
  ${()=>{switch(f){case"circle":return o.css`
            border-radius: ${e.radii.full};
          `;case"square":return o.css`
            border-radius: ${l==="small"?e.radii.large:e.radii["2xLarge"]};
          `;case"rounded":return o.css`
            border-radius: ${e.radii.extraLarge};
          `;default:return""}}}

  ${()=>l==="medium"&&n?o.css`
          padding-left: ${e.space[14]};
          padding-right: ${e.space[14]};
        `:""}

  ${()=>s&&a&&c==="transparent"?o.css`
          background-color: ${e.colors.backgroundSecondary};
        `:""}

    &:disabled {
      background-color: ${e.colors.grey};
      ${c!=="transparent"&&o.css`
        color: ${e.colors.background};
      `}
      transform: translateY(0px);
      filter: brightness(1);
    }

    ${m&&`
      background-color: ${e.colors.grey};
      color: ${e.colors.textTertiary};

      &:hover {
        transform: translateY(0px);
        filter: brightness(1);
        background-color: ${e.colors.grey};
        cursor: initial
      }

      ${U.md.min(o.css`
        &:active {
          pointer-events: none;
        }
      `)}
    `}
  `),Jn=u.default.div(()=>o.css`
    ${Xn}
  `),Qn=u.default.div(()=>o.css``),eo=u.default(K)(({theme:e,$fullWidthContent:t})=>o.css`
    color: inherit;
    font-size: inherit;
    font-weight: ${e.fontWeights.semiBold};
    ${t&&"width: 100%;"}
  `),to=u.default.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9b911;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  position: absolute;
  right: -10px;
  top: -10px;
  color: white;
`,je=r.forwardRef(({center:e,children:t,disabled:n,href:a,prefix:s,loading:i,rel:l,shape:c,size:d="medium",suffix:f,tabIndex:m,target:b,tone:$="accent",type:p="button",variant:E="primary",zIndex:C,onClick:v,pressed:S=!1,shadowless:h=!1,outlined:x=!1,fullWidthContent:g=!1,as:k,psuedoDisabled:y,shouldShowTooltipIndicator:T,...R},L)=>{const z=r.createElement(eo,{$fullWidthContent:g,ellipsis:!0},t);let j;return c?j=i?r.createElement(ye,{color:"background"}):z:j=r.createElement(r.Fragment,null,s&&r.createElement(Jn,{center:e,size:d,side:"left"},s),z,(i||f)&&r.createElement(Qn,{center:e,size:d,side:"right"},i?r.createElement(ye,{color:"background"}):f)),r.createElement(Kn,{...R,$center:e,$fullWidthContent:g,$outlined:x,$pressed:S,$psuedoDisabled:y,$shadowless:h,$shape:c,$size:d,$tone:$,$variant:E,as:k,disabled:n,href:a,position:C&&"relative",ref:L,rel:l,tabIndex:m,target:b,type:p,zIndex:C,onClick:O=>{if(y){O.preventDefault(),O.stopPropagation();return}v==null||v(O)}},y&&T&&r.createElement(to,null,"?"),j)});je.displayName="Button";const ro=u.default.div(({theme:e,$shadow:t})=>o.css`
    padding: ${e.space[6]};
    border-radius: ${e.radii["2xLarge"]};
    background-color: ${e.colors.background};
    ${U.lg.min(o.css`
      border-radius: ${e.radii["3xLarge"]};
    `)}

    ${t&&e.mode==="light"&&o.css`
      box-shadow: 0px 0px ${e.radii["2xLarge"]} rgba(0, 0, 0, 0.1);
      border-radius: ${e.radii["2xLarge"]};
      ${U.lg.min(o.css`
        box-shadow: 0px 0px ${e.radii["3xLarge"]} rgba(0, 0, 0, 0.1);
        border-radius: ${e.radii["3xLarge"]};
      `)}
    `}
  `),et=({children:e,shadow:t,...n})=>r.createElement(ro,{...n,$shadow:t},e);et.displayName="Card";var ae=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},no="Expected a function",Rt=0/0,oo="[object Symbol]",ao=/^\s+|\s+$/g,so=/^[-+]0x[0-9a-f]+$/i,io=/^0b[01]+$/i,lo=/^0o[0-7]+$/i,co=parseInt,uo=typeof ae=="object"&&ae&&ae.Object===Object&&ae,go=typeof self=="object"&&self&&self.Object===Object&&self,fo=uo||go||Function("return this")(),po=Object.prototype,bo=po.toString,$o=Math.max,mo=Math.min,_e=function(){return fo.Date.now()};function wo(e,t,n){var a,s,i,l,c,d,f=0,m=!1,b=!1,$=!0;if(typeof e!="function")throw new TypeError(no);t=Tt(t)||0,Je(n)&&(m=!!n.leading,b="maxWait"in n,i=b?$o(Tt(n.maxWait)||0,t):i,$="trailing"in n?!!n.trailing:$);function p(y){var T=a,R=s;return a=s=void 0,f=y,l=e.apply(R,T),l}function E(y){return f=y,c=setTimeout(S,t),m?p(y):l}function C(y){var T=y-d,R=y-f,L=t-T;return b?mo(L,i-R):L}function v(y){var T=y-d,R=y-f;return d===void 0||T>=t||T<0||b&&R>=i}function S(){var y=_e();if(v(y))return h(y);c=setTimeout(S,C(y))}function h(y){return c=void 0,$&&a?p(y):(a=s=void 0,l)}function x(){c!==void 0&&clearTimeout(c),f=0,a=d=s=c=void 0}function g(){return c===void 0?l:h(_e())}function k(){var y=_e(),T=v(y);if(a=arguments,s=this,d=y,T){if(c===void 0)return E(d);if(b)return c=setTimeout(S,t),p(d)}return c===void 0&&(c=setTimeout(S,t)),l}return k.cancel=x,k.flush=g,k}function Je(e){var t=typeof e;return!!e&&(t=="object"||t=="function")}function ho(e){return!!e&&typeof e=="object"}function Co(e){return typeof e=="symbol"||ho(e)&&bo.call(e)==oo}function Tt(e){if(typeof e=="number")return e;if(Co(e))return Rt;if(Je(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=Je(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=e.replace(ao,"");var n=io.test(e);return n||lo.test(e)?co(e.slice(2),n?2:8):so.test(e)?Rt:+e}var Mt=wo;const Ce=350,Ge=(e,t,n,a,s)=>{const i=t.top-n.height-a-s,l=t.left-n.width-a-s,c=window.innerWidth-t.left-t.width-n.width-a-s,d=window.innerHeight-t.top-t.height-n.height-a-s;return e==="top"&&i<0&&d>i?"bottom":e==="right"&&c<0&&l>c?"left":e==="bottom"&&d<0&&i>d?"top":e==="left"&&l<0&&c>l?"right":e},vo=(e,t,n,a)=>{let s="";n==="top"?s=`translate(0, -${t}px)`:n==="right"?s=`translate(${e*-1+10}px, 0)`:n==="bottom"?s=`translate(0, ${t}px)`:s=`translate(${e-10}px, 0);`;let i="";return a==="top"?i=`translate(0, -${t}px)`:a==="right"?i=`translate(${e*-1+10}px, 0)`:a==="bottom"?i=`translate(0, ${t}px)`:i=`translate(${e-10}px, 0);`,{translate:s,mobileTranslate:i}},yo=u.default.div(({$translate:e,$mobileTranslate:t,$width:n,$mobileWidth:a})=>o.css`
    position: absolute;
    box-sizing: border-box;
    z-index: 20;
    pointer-events: none;
    width: ${a}px;
    transform: ${t};

    ${U.md.min(o.css`
      width: ${n}px;
      transform: ${e};
    `)}
  `),xo=(e,t,n,a,s,i,l)=>{const c=document.getElementById(e),d=c==null?void 0:c.getBoundingClientRect(),f=t==null?void 0:t.current,m=f==null?void 0:f.getBoundingClientRect();if(n.style.opacity="0",n.style.top="10px",n.style.left="10px",d){const b=window.scrollY+d.y+d.height/2-m.height/2,$=d.x+d.width/2-m.width/2,p=-m.width+(d.left-$)-i,E=m.height+i,C=Ge(a,d,m,0,0),v=Ge(s,d,m,0,0);l({top:b,left:$,horizontalClearance:p,verticalClearance:E,idealPlacement:C,idealMobilePlacement:v})}},Oe=({popover:e,placement:t="top",mobilePlacement:n="top",animationFn:a,tooltipRef:s,targetId:i,onShowCallback:l,width:c=250,mobileWidth:d=150,useIdealSide:f=!1,additionalGap:m=0})=>{const[b,$]=r.useState({top:100,left:100,horizontalClearance:100,verticalClearance:100,idealPlacement:t,idealMobilePlacement:n}),p=r.useRef(null),E=r.useRef(!1),C=r.useRef(!1),v=r.useMemo(()=>a?(x,g,k,y)=>a(x,g,k,y):(x,g,k,y)=>vo(x,g,k,y),[a]);r.useEffect(()=>{const x=document.getElementById(i),g=p.current;g&&xo(i,s,g,t,n,m,$);const k=Mt(()=>{if(console.log("handleMousenter"),C.current)return;E.current=!0;const R=document.getElementById(i),L=R==null?void 0:R.getBoundingClientRect(),z=s==null?void 0:s.current,j=z==null?void 0:z.getBoundingClientRect(),O=p.current;if(L&&j){const Z=window.scrollY+L.y+L.height/2-j.height/2,A=L.x+L.width/2-j.width/2,se=-j.width+(L.left-A)-m,M=j.height+m;O?(O.style.transition="initial",O.style.top=`${Z}px`,O.style.left=`${A}px`):console.error("no popover element");const P=Ge(t,L,j,0,0),F=Ge(n,L,j,0,0);$({top:Z,left:A,horizontalClearance:se,verticalClearance:M,idealPlacement:P,idealMobilePlacement:F}),setTimeout(()=>{!C.current&&O&&(O.style.transition=`all ${Ce}ms cubic-bezier(1, 0, 0.22, 1.6)`,O.style.opacity="1"),l==null||l(),E.current=!1},200)}},Ce,{leading:!0,trailing:!1}),y=Mt(()=>{C.current=!0,g&&(g.style.opacity="0"),setTimeout(()=>{if(!g){console.error("no popover element");return}E.current?setTimeout(()=>{g.style.transition="initial",g.style.top="10px",g.style.left="10px",C.current=!1},Ce):(g.style.transition="initial",g.style.top="10px",g.style.left="10px",C.current=!1)},Ce)},Ce,{leading:!0,trailing:!1}),T=()=>{const R=document.getElementById(i),L=R==null?void 0:R.getBoundingClientRect(),z=s==null?void 0:s.current,j=z==null?void 0:z.getBoundingClientRect(),O=p.current,Z=window.scrollY+L.y+L.height/2-j.height/2,A=L.x+L.width/2-j.width/2;O.style.transition="initial",O.style.top=`${Z}px`,O.style.left=`${A}px`};return x==null||x.addEventListener("mouseenter",k),x==null||x.addEventListener("mouseleave",y),addEventListener("resize",T),()=>{x==null||x.removeEventListener("mouseover",k),x==null||x.removeEventListener("mouseleave",y),removeEventListener("resize",T)}},[i]);const{translate:S,mobileTranslate:h}=v(b.horizontalClearance,b.verticalClearance,f?b.idealPlacement:t,f?b.idealMobilePlacement:n);return tr.createPortal(r.createElement(yo,{$translate:S,$mobileTranslate:h,$width:c,$mobileWidth:d,id:"popoverContainer","data-testid":"popoverContainer",ref:p},e),document==null?void 0:document.body)};Oe.displayName="DynamicPopover";const ko=(e,t,n,a)=>{const s=i=>{e.current&&!e.current.contains(i.target)&&n()};Be.useEffect(()=>(a?document.addEventListener(t,s):document.removeEventListener(t,s),()=>{document.removeEventListener(t,s)}),[a])},Eo=typeof window!="undefined"?r.useLayoutEffect:r.useEffect,Ue={serverHandoffComplete:!1},So=()=>{const[e,t]=r.useState(Ue.serverHandoffComplete);return r.useEffect(()=>{e||t(!0)},[e]),r.useEffect(()=>{Ue.serverHandoffComplete||(Ue.serverHandoffComplete=!0)},[]),e},Lo="thorin";let Ro=0;function Vt(){return++Ro}const To=()=>{const e=So(),[t,n]=r.useState(e?Vt:null);return Eo(()=>{t===null&&n(Vt())},[t]),t!=null?`${Lo}`+t:void 0},mr=({description:e,error:t,id:n}={})=>{const a=To();return r.useMemo(()=>{const s=`${a}${n?`-${n}`:""}`,i=`${s}-label`;let l,c;e&&(c={id:`${s}-description`},l=c.id);let d;return t&&(d={id:`${s}-error`},l=`${l?`${l} `:""}${d.id}`),{content:{"aria-describedby":l,"aria-labelledby":i,id:s},description:c,error:d,label:{htmlFor:s,id:i}}},[a,e,t,n])},Bt=r.createContext(void 0),Mo=u.default.label(({theme:e})=>o.css`
    color: ${e.colors.textTertiary};
    font-weight: ${e.fontWeights.semiBold};
    display: flex;
    cursor: pointer;
  `),Vo=u.default.span(({theme:e})=>o.css`
    margin-left: ${e.space[4]};
  `),Bo=u.default.div(({theme:e,$inline:t})=>o.css`
    display: flex;
    align-items: flex-end;
    padding-left: ${t?"0":e.space[4]};
    padding-right: ${t?"0":e.space[4]};
    padding-top: 0;
    padding-bottom: 0;
  `),Po=u.default.span(({theme:e})=>o.css`
    color: ${e.colors.red};
    ::before {
      content: ' ';
      white-space: pre;
    }
  `),Ve=({ids:e,label:t,labelSecondary:n,required:a,$inline:s,...i})=>r.createElement(Bo,{...i,...e.label,$inline:s},r.createElement(Mo,{...e.label,$inline:s},t," ",a&&r.createElement(r.Fragment,null,r.createElement(Po,null,"*"),r.createElement(J,null,"required"))),n&&r.createElement(Vo,null,n)),Pt=u.default.div(({theme:e,$inline:t,$width:n,$labelRight:a})=>o.css`
    display: flex;
    flex-direction: ${t?a?"row-reverse":"row":"column"};
    align-items: ${t?"center":"normal"};
    gap: ${t?e.space["2.5"]:e.space[2]};
    width: ${e.space[n]};
  `),Go=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[2]};
    flex: 1;
  `),Ye=u.default.div(({theme:e,$inline:t})=>o.css`
    padding: 0 ${t?"0":e.space[4]};
    color: ${e.colors.textSecondary};
  `),qe=u.default.div(({theme:e,$inline:t})=>`
    color: ${e.colors.red};
    padding: 0 ${t?"0":e.space[4]};
`),Gt=(e,t,n)=>typeof n=="string"?n:(n==null?void 0:n[e])||t,Q=({children:e,description:t,error:n,hideLabel:a,id:s,label:i,labelSecondary:l,required:c,inline:d,width:f="full",labelRight:m=!1,labelPlacement:b,...$})=>{const p=mr({id:s,description:t!==void 0,error:n!==void 0});let E;typeof e=="function"?E=r.createElement(Bt.Provider,{value:p},r.createElement(Bt.Consumer,null,S=>e(S))):e?E=r.cloneElement(e,p.content):E=e;const C=Gt("description","bottom",b),v=Gt("error","bottom",b);return d?r.createElement(Pt,{$inline:d,$labelRight:m,$width:f},r.createElement(Go,null,a?r.createElement(J,null,r.createElement(Ve,{...$,ids:p,label:i,labelSecondary:l,required:c})):r.createElement(Ve,{...$,ids:p,label:i,labelSecondary:l,required:c,$inline:d}),t&&r.createElement(Ye,{$inline:d},t),n&&r.createElement(qe,{"aria-live":"polite",...p.error,$inline:d},n)),r.createElement("div",null,E)):r.createElement(Pt,{$width:f},a?r.createElement(J,null,r.createElement(Ve,{...$,ids:p,label:i,labelSecondary:l,required:c})):r.createElement(Ve,{...$,ids:p,label:i,labelSecondary:l,required:c}),t&&C==="top"&&r.createElement(Ye,{...p.description},t),n&&v==="top"&&r.createElement(qe,{"aria-live":"polite",...p.error},n),E,t&&C==="bottom"&&r.createElement(Ye,{...p.description},t),n&&v==="bottom"&&r.createElement(qe,{"aria-live":"polite",...p.error},n))};Q.displayName="Field";const zo=(e,t)=>{const n=t==null?void 0:t.split(", ");if(!n)return!0;const a=zt(e);return n.some(s=>{const i=zt(s);return i.type===a.type&&i.subtype===a.subtype})},zt=e=>{const t=e.split("/");return{type:t[0],subtype:t[1]}},Ht={},tt=r.forwardRef(({accept:e,autoFocus:t,children:n,defaultValue:a,disabled:s,error:i,id:l,maxSize:c,name:d,required:f,tabIndex:m,onBlur:b,onChange:$,onError:p,onFocus:E,onReset:C,...v},S)=>{const h=r.useRef(null),x=S||h,[g,k]=r.useState(Ht),y=i?!0:void 0,T=mr({id:l,error:y}),R=r.useCallback((M,P)=>{if(c&&M.size>c*1e6){P==null||P.preventDefault(),p&&p(`File is ${(M.size/1e6).toFixed(2)} MB. Must be smaller than ${c} MB`);return}k(F=>({...F,file:M,name:M.name,type:M.type})),$&&$(M)},[c,$,p]),L=r.useCallback(M=>{const P=M.target.files;!(P!=null&&P.length)||R(P[0],M)},[R]),z=r.useCallback(M=>{M.preventDefault(),k(P=>({...P,droppable:!0}))},[]),j=r.useCallback(M=>{M.preventDefault(),k(P=>({...P,droppable:!1}))},[]),O=r.useCallback(M=>{M.preventDefault(),k(F=>({...F,droppable:!1}));let P;if(M.dataTransfer.items){const F=M.dataTransfer.items;if((F==null?void 0:F[0].kind)!=="file"||(P=F[0].getAsFile(),!P))return}else{const F=M.dataTransfer.files;if(!(F!=null&&F.length))return;P=F[0]}!zo(P.type,e)||R(P,M)},[R,e]),Z=r.useCallback(M=>{k(P=>({...P,focused:!0})),E&&E(M)},[E]),A=r.useCallback(M=>{k(P=>({...P,focused:!1})),b&&b(M)},[b]),se=r.useCallback(M=>{M.preventDefault(),k(Ht),x.current&&(x.current.value=""),C&&C()},[x,C]);return r.useEffect(()=>{!a||k({previewUrl:a.url,name:a.name,type:a.type})},[]),r.useEffect(()=>{if(!g.file)return;const M=URL.createObjectURL(g.file);return k(P=>({...P,previewUrl:M})),()=>URL.revokeObjectURL(M)},[g.file]),r.createElement("div",null,r.createElement(J,null,r.createElement("input",{...v,...T.content,accept:e,"aria-invalid":y,autoFocus:t,disabled:s,name:d,ref:x,required:f,tabIndex:m,type:"file",onBlur:A,onChange:L,onFocus:Z})),r.createElement("label",{...T.label,onDragLeave:j,onDragOver:z,onDrop:O},n({...g,reset:se})))});tt.displayName="FileInput";const Ho=u.default.div(({theme:e,$textAlign:t,$textTransform:n,$level:a,$responsive:s,$color:i})=>o.css`
    ${t?o.css`
          text-align: ${t};
        `:""}
    ${n?o.css`
          text-transform: ${n};
        `:""}

  ${()=>{switch(a){case"1":return o.css`
            font-size: ${e.fontSizes.headingOne};
            font-weight: ${e.fontWeights.semiBold};
            letter-spacing: ${e.letterSpacings["-0.02"]};
            line-height: 4rem;
          `;case"2":return o.css`
            font-size: ${e.fontSizes.headingTwo};
            font-weight: ${e.fontWeights.semiBold};
            letter-spacing: ${e.letterSpacings["-0.02"]};
            line-height: 2.5rem;
          `;default:return""}}}
  
  ${()=>{if(s)switch(a){case"1":return o.css`
              font-size: ${e.fontSizes.headingTwo};
              ${U.lg.min(o.css`
                font-size: ${e.fontSizes.headingOne};
              `)}
            `;case"2":return o.css`
              font-size: ${e.fontSizes.extraLarge};
              letter-spacing: normal;
              ${U.sm.min(o.css`
                font-size: ${e.fontSizes.headingTwo};
                letter-spacing: -0.02;
              `)}
            `;default:return""}}}

  ${i&&o.css`
      color: ${e.colors[i]};
    `}
  
  font-family: ${e.fonts.sans};
  `),Fe=r.forwardRef(({align:e,children:t,as:n="h1",id:a,level:s="2",responsive:i,transform:l,color:c,...d},f)=>r.createElement(Ho,{...d,$color:c,$level:s,$responsive:i,$textAlign:e,$textTransform:l,as:n,id:a,ref:f},t));Fe.displayName="Heading";const De=({children:e,className:t,el:n="div"})=>{const[a]=r.useState(document.createElement(n));return t&&a.classList.add(t),r.useEffect(()=>(document.body.appendChild(a),()=>{document.body.removeChild(a)}),[]),On.createPortal(e,a)};De.displayName="Portal";const jo=u.default.div(({theme:e,$showTop:t,$showBottom:n})=>o.css`
    overflow: auto;
    position: relative;

    border-color: rgba(${e.shadesRaw.foreground}, 0.05);
    transition: border-color 0.15s ease-in-out;

    /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: ${e.space["1.5"]};
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border: none;
      border-radius: ${e.radii.full};
      border-right-style: inset;
      border-right-width: calc(100vw + 100vh);
      border-color: inherit;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &:hover {
      border-color: rgba(${e.shadesRaw.foreground}, 0.2);
    }

    &::before,
    &::after {
      content: '';
      position: sticky;
      left: 0;
      width: 100%;
      display: block;
      height: ${e.space.px};
      background-color: rgba(${e.shadesRaw.foreground}, 0);
      transition: background-color 0.15s ease-in-out;
    }

    &::before {
      top: 0;
      ${t&&o.css`
        background-color: rgba(${e.shadesRaw.foreground}, 0.1);
      `}
    }
    &::after {
      bottom: 0;
      ${n&&o.css`
        background-color: rgba(${e.shadesRaw.foreground}, 0.1);
      `}
    }
  `),jt=u.default.div(()=>o.css`
    display: block;
    height: 0px;
  `),wr=({topTriggerPx:e=16,bottomTriggerPx:t=16,onReachedTop:n,onReachedBottom:a,children:s,...i})=>{const l=r.useRef(null),c=r.useRef(null),d=r.useRef(null),f=r.useRef({onReachedTop:n,onReachedBottom:a}),[m,b]=r.useState(!1),[$,p]=r.useState(!1),E=C=>{var h,x,g,k;const v=[!1,-1],S=[!1,-1];for(let y=0;y<C.length;y+=1){const T=C[y],R=T.target===c.current?v:S;T.time>R[1]&&(R[0]=T.isIntersecting,R[1]=T.time)}v[1]!==-1&&b(!v[0]),S[1]!==-1&&p(!S[0]),v[0]&&((x=(h=f.current).onReachedTop)==null||x.call(h)),S[0]&&((k=(g=f.current).onReachedBottom)==null||k.call(g))};return r.useEffect(()=>{const C=l.current,v=c.current,S=d.current;let h;return C&&v&&S&&(h=new IntersectionObserver(E,{root:C,threshold:1,rootMargin:`${e}px 0px ${t}px 0px`}),h.observe(v),h.observe(S)),()=>{h.disconnect()}},[t,e]),r.useEffect(()=>{f.current={onReachedTop:n,onReachedBottom:a}},[n,a]),r.createElement(jo,{$showBottom:$,$showTop:m,ref:l,...i},r.createElement(jt,{"data-testid":"scrollbox-top-intersect",ref:c}),s,r.createElement(jt,{"data-testid":"scrollbox-bottom-intersect",ref:d}))},hr=r.createContext(void 0),rt=({children:e,loading:t})=>r.createElement(hr.Provider,{value:t},e);rt.displayName="SkeletonGroup";const Oo=u.default.div(({theme:e,$active:t})=>o.css`
    ${t&&o.css`
      background-color: ${e.colors.foregroundSecondary};
      border-radius: ${e.radii.medium};
      width: ${e.space.fit};
    `}
  `),Fo=u.default.span(({$active:e})=>o.css`
    display: block;
    ${e?o.css`
          visibility: hidden;
        `:""}
  `),nt=({as:e,children:t,loading:n,...a})=>{const s=r.useContext(hr),i=n!=null?n:s;return r.createElement(Oo,{...a,$active:i,as:e},r.createElement(Fo,{$active:i},t))};nt.displayName="Skeleton";const Do=u.default.div(({theme:e,$hover:t,$size:n,$tone:a})=>o.css`
    line-height: normal;
    align-items: center;
    display: flex;
    border-radius: ${e.radii.full};
    font-weight: ${e.fontWeights.medium};
    width: ${e.space.max};

    ${t&&o.css`
      transition-duration: ${e.transitionDuration[150]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${e.transitionTimingFunction.inOut};
    `}

    ${()=>{switch(n){case"small":return o.css`
            height: ${e.space[5]};
            font-size: ${e.fontSizes.label};
          `;case"medium":return o.css`
            height: ${e.space[6]};
            font-size: ${e.fontSizes.small};
          `;default:return""}}}

  ${()=>{switch(a){case"accent":return o.css`
            color: ${e.colors.accent};
            background-color: ${e.colors.accentTertiary};
          `;case"secondary":return o.css`
            color: ${e.colors.textTertiary};
            background-color: ${e.colors.foregroundTertiary};
          `;case"blue":return o.css`
            color: ${e.colors.blue};
            background-color: rgba(
              ${e.accentsRaw.blue},
              calc(${e.shades.accentSecondary} * 0.5)
            );
          `;case"green":return o.css`
            color: ${e.colors.green};
            background-color: rgba(
              ${e.accentsRaw.green},
              calc(${e.shades.accentSecondary} * 0.5)
            );
          `;case"red":return o.css`
            color: ${e.colors.red};
            background-color: rgba(
              ${e.accentsRaw.red},
              calc(${e.shades.accentSecondary} * 0.5)
            );
          `;default:return""}}}
  
  ${()=>{if(t&&a==="accent")return o.css`
          background-color: ${e.colors.accentTertiary};

          &:hover,
          &:active {
            background-color: ${e.colors.accentSecondary};
          }
        `;if(t&&a==="secondary")return o.css`
          color: ${e.colors.textSecondary};
          background-color: ${e.colors.foregroundTertiary};

          &:hover,
          &:active {
            color: ${e.colors.text};
            background-color: ${e.colors.foregroundSecondary};
          }
        `;if(t&&a==="blue")return o.css`
          &:hover,
          &:active {
            background-color: ${e.colors.blue};
          }
        `;if(t&&a==="green")return o.css`
          &:hover,
          &:active {
            background-color: ${e.colors.green};
          }
        `;if(t&&a==="red")return o.css`
          &:hover,
          &:active {
            background-color: ${e.colors.red};
          }
        `}}
  `),Ao=u.default.label(({theme:e})=>o.css`
    align-items: center;
    border-radius: ${e.radii.full};
    display: flex;
    height: ${e.space.full};
    padding: 0 ${e.space[2]};
    box-shadow: 0 0 0 2px ${e.colors.background};
  `),Zo=u.default.div(({theme:e})=>o.css`
    padding: 0 ${e.space[2]};
  `),Ae=({as:e="div",children:t,hover:n,label:a,size:s="medium",tone:i="secondary",...l})=>r.createElement(Do,{...l,$hover:n,$size:s,$tone:i,as:e},a&&r.createElement(Ao,null,r.createElement("span",null,a)),r.createElement(Zo,{as:e},t));Ae.displayName="Tag";const xe=({children:e,surface:t,onDismiss:n,noBackground:a=!1,className:s="modal",open:i})=>{const[l,c]=rr.useTransition({timeout:{enter:50,exit:300},mountOnEnter:!0,unmountOnExit:!0}),d=r.useRef(null),f=t||Qe,m=b=>b.target===d.current&&n&&n();return r.useEffect(()=>{const{style:b,dataset:$}=document.body,p=()=>parseInt($.backdrops||"0"),E=v=>$.backdrops=String(p()+v),C=(v,S,h)=>{b.width=v,b.position=S,b.top=h};if(c(i||!1),typeof window!="undefined"&&!a&&i)return p()===0&&C(`${document.body.clientWidth}px`,"fixed",`-${window.scrollY}px`),E(1),()=>{const v=parseFloat(b.top||"0")*-1;p()===1&&(C("","",""),window.scroll({top:v})),E(-1)}},[i,a]),l!=="unmounted"?r.createElement(De,{className:s},n&&r.createElement(f,{$empty:a,$state:l,ref:d,onClick:m}),e({state:l})):null};xe.displayName="Backdrop";const Wo=(e="",t=10,n=5,a=5)=>e.length<t?e:`${e.slice(0,n)}...${e.slice(-a)}`,ee=(e,t)=>e["data-testid"]?String(e["data-testid"]):t,Cr=e=>t=>t[e==="small"?0:e==="large"?2:1],No=(e,t)=>{if(Object.keys(e.colors.gradients).includes(t)){const n=t;return e.colors.gradients[n]}return e.colors[t]},Io=(e,{$size:t,$border:n,$color:a,$gradient:s})=>{const i=Cr(t),l=i([e.space[12],e.space[12],e.space[20]]),c=i([e.space[6],e.space[6],e.space[10]]),d=i([e.space[7],e.space[8],e.space[12]]),f=i([e.space["3.5"],e.space[4],e.space[6]]),m=s?No(e,a):e.colors[a],b=n?`calc(${d} - 2px)`:i([e.space[5],e.space[6],e.space[9]]),$=n?i(["1.25px","1.25px","1.75px"]):"1px",p=n?e.colors.border:e.colors.borderSecondary,E=n?"border-box":"content-box",C=n?"border-box":"content-box";return o.css`
    box-sizing: border-box;
    background: ${e.colors.foregroundSecondary};
    background-clip: content-box;
    width: ${l};
    height: ${d};
    border-radius: ${f};
    border-width: 1px;
    border-style: solid;
    border-color: ${e.colors.borderSecondary};
    transition: all 90ms ease-in-out;

    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    &:active {
      transform: translateY(0px);
      filter: brightness(1.1);
    }

    &:checked {
      background: ${m};
      background-clip: content-box;
      border-color: transparent;
    }

    &::before {
      content: '';
      border-width: ${$};
      border-style: solid;
      border-color: ${p};
      background-color: ${e.colors.background};
      background-clip: ${C};
      border-radius: ${e.radii.full};
      transform: translateX(-${c})
        translateX(${f});
      transition: all 90ms ease-in-out;
      box-sizing: ${E};
      width: ${b};
      height: ${b};
    }

    &:checked::before {
      transform: translateX(${c})
        translateX(-${f});
      border-color: ${n?p:"transparent"};
    }

    ${n&&o.css`
      &::after {
        content: '';
        display: block;
        position: absolute;
        background-color: ${p};
        width: ${i(["1.5px","1.5px","2px"])};
        border-radius: 2px;
        height: ${i(["9px","10px","16px"])};
        left: 50%;
        top: 50%;
        transform: translateX(-${c})
          translateX(${f}) translate(-50%, -50%);
        transition: all 90ms ease-in-out;
        z-index: 1;
      }

      &:checked::after {
        transform: translateX(${c})
          translateX(-${f}) translate(-50%, -50%);
      }
    `}
  `},_o=(e,{$background:t,$size:n,$color:a,$border:s})=>{const i=Cr(n),l=i([e.space[7],e.space[8],e.space[12]]),c=s?e.colors.borderSecondary:"transparent",d=i([e.space["3.5"],e.space[4],e.space[6]]);return o.css`
    width: ${l};
    height: ${l};
    border-width: 1px;
    border-color: ${c};
    border-radius: ${e.space[2]};
    background-color: ${e.colors[t]};
    background-clip: content-box;

    &:hover {
      transform: translateY(-1px);
      filter: contrast(0.7);
    }

    &:active {
      transform: translateY(0px);
      filter: contrast(1);
    }

    &::before {
      content: '';
      background-color: ${e.colors[a]};
      mask-image: ${`url('data:image/svg+xml; utf8, <svg width="${d}" height="${d}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.625L10.125 20.125L22 3.875" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>')`};
      width: ${d};
      height: ${d};
      transform: scale(0);
      transition: all 90ms ease-in-out;
    }

    &:checked::before {
      transform: scale(1);
    }
  `},Uo=u.default.input(({theme:e,...t})=>o.css`
    font: inherit;
    display: grid;
    position: relative;
    place-content: center;
    transition: transform 150ms ease-in-out, filter 150ms ease-in-out;
    cursor: pointer;
    margin: ${e.space[1]} 0;

    ${()=>t.$variant==="switch"?Io(e,t):_o(e,t)}
  `),ot=r.forwardRef(({description:e,disabled:t,error:n,hideLabel:a,id:s,label:i,labelSecondary:l,inline:c=!0,name:d,required:f,tabIndex:m,value:b,checked:$,width:p,onBlur:E,onChange:C,onFocus:v,variant:S="regular",color:h="blue",gradient:x=!1,background:g="grey",size:k="small",border:y=!1,...T},R)=>{const L=r.useRef(null),z=R||L;return r.createElement(Q,{description:e,error:n,hideLabel:a,id:s,inline:c,label:i,labelSecondary:l,required:f,width:p},r.createElement(Uo,{...T,"data-testid":ee(T,"checkbox"),"aria-invalid":n?!0:void 0,type:"checkbox",$background:g,$border:y,$color:h,$gradient:x,$size:k,$variant:S,checked:$,disabled:t,name:d,ref:z,tabIndex:m,value:b,onBlur:E,onChange:C,onFocus:v}))});ot.displayName="Checkbox";const at=({title:e,titleId:t,...n})=>r.createElement("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.67189 2.89631C10.1562 0.367896 13.8438 0.367896 15.3281 2.89631L23.4693 16.7715C24.9833 19.3505 23.0661 22.5 20.1412 22.5H3.85878C0.934016 22.5 -0.983164 19.3507 0.530497 16.7718L8.67189 2.89631ZM11.2575 4.41565L3.11646 18.2906C2.82077 18.7942 3.1643 19.5 3.85878 19.5H20.1412C20.8357 19.5 21.1794 18.7945 20.8837 18.2909L12.7425 4.41565C12.4171 3.86186 11.5829 3.86186 11.2575 4.41565ZM12 7.93732C12.828 7.93732 13.4993 8.60889 13.4993 9.43732V11.7499C13.4993 12.5783 12.828 13.2499 12 13.2499C11.172 13.2499 10.5007 12.5783 10.5007 11.7499V9.43732C10.5007 8.60889 11.172 7.93732 12 7.93732ZM10.5007 16.3749C10.5007 15.5465 11.172 14.8749 12 14.8749H12.0118C12.8398 14.8749 13.511 15.5465 13.511 16.3749C13.511 17.2034 12.8398 17.8749 12.0118 17.8749H12C11.172 17.8749 10.5007 17.2034 10.5007 16.3749Z",fill:"currentColor"})),vr=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.5605 10.9395L13.0605 6.4395C12.7776 6.16626 12.3987 6.01507 12.0054 6.01849C11.6121 6.02191 11.2359 6.17966 10.9578 6.45777C10.6797 6.73588 10.5219 7.1121 10.5185 7.5054C10.5151 7.89869 10.6663 8.2776 10.9395 8.5605L12.879 10.5H7.5C7.10218 10.5 6.72064 10.658 6.43934 10.9393C6.15804 11.2206 6 11.6022 6 12C6 12.3978 6.15804 12.7794 6.43934 13.0607C6.72064 13.342 7.10218 13.5 7.5 13.5H12.879L10.9395 15.4395C10.7962 15.5779 10.682 15.7434 10.6033 15.9264C10.5247 16.1094 10.4834 16.3062 10.4816 16.5054C10.4799 16.7046 10.5178 16.9021 10.5933 17.0864C10.6687 17.2708 10.7801 17.4383 10.9209 17.5791C11.0617 17.7199 11.2292 17.8313 11.4136 17.9067C11.5979 17.9822 11.7954 18.0201 11.9946 18.0184C12.1938 18.0166 12.3906 17.9753 12.5736 17.8967C12.7566 17.818 12.9221 17.7038 13.0605 17.5605L17.5605 13.0605C17.8417 12.7792 17.9997 12.3977 17.9997 12C17.9997 11.6023 17.8417 11.2208 17.5605 10.9395Z",fill:"currentColor"})),yr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14 5l7 7m0 0l-7 7m7-7H3"})),xr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 10l7-7m0 0l7 7m-7-7v18"})),kr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"})),st=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM10.0605 7.9395C9.7776 7.66626 9.39869 7.51507 9.0054 7.51849C8.6121 7.52191 8.23588 7.67966 7.95777 7.95777C7.67966 8.23588 7.52191 8.6121 7.51849 9.0054C7.51507 9.39869 7.66626 9.7776 7.9395 10.0605L9.879 12L7.9395 13.9395C7.79624 14.0779 7.68196 14.2434 7.60335 14.4264C7.52473 14.6094 7.48336 14.8062 7.48162 15.0054C7.47989 15.2046 7.51785 15.4021 7.59327 15.5864C7.66869 15.7708 7.78007 15.9383 7.92091 16.0791C8.06175 16.2199 8.22922 16.3313 8.41357 16.4067C8.59791 16.4822 8.79543 16.5201 8.9946 16.5184C9.19377 16.5166 9.3906 16.4753 9.57361 16.3967C9.75661 16.318 9.92213 16.2038 10.0605 16.0605L12 14.121L13.9395 16.0605C14.2224 16.3337 14.6013 16.4849 14.9946 16.4815C15.3879 16.4781 15.7641 16.3203 16.0422 16.0422C16.3203 15.7641 16.4781 15.3879 16.4815 14.9946C16.4849 14.6013 16.3337 14.2224 16.0605 13.9395L14.121 12L16.0605 10.0605C16.3337 9.7776 16.4849 9.39869 16.4815 9.0054C16.4781 8.6121 16.3203 8.23588 16.0422 7.95777C15.7641 7.67966 15.3879 7.52191 14.9946 7.51849C14.6013 7.51507 14.2224 7.66626 13.9395 7.9395L12 9.879L10.0605 7.9395Z",fill:"currentColor"})),it=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M2 12.625L10.125 20.125L22 3.875",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"})),Er=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 9l-7 7-7-7"})),Sr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 19l-7-7 7-7"})),Lr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"})),Rr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 15l7-7 7 7"})),lt=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0.584985 0.610577C0.959663 0.235635 1.46777 0.0250036 1.99756 0.0250036C2.52736 0.0250036 3.03546 0.235635 3.41014 0.610577L11.9875 9.19658L20.5649 0.610577C20.7492 0.419556 20.9697 0.267192 21.2134 0.162374C21.4572 0.0575557 21.7194 0.00238315 21.9846 7.55141e-05C22.2499 -0.00223212 22.513 0.0483709 22.7586 0.148933C23.0041 0.249494 23.2272 0.398001 23.4148 0.585786C23.6024 0.773571 23.7508 0.996876 23.8512 1.24267C23.9517 1.48846 24.0022 1.75182 23.9999 2.01738C23.9976 2.28294 23.9425 2.54538 23.8378 2.78938C23.7331 3.03339 23.5809 3.25408 23.39 3.43858L14.8127 12.0246L23.39 20.6106C23.754 20.9878 23.9554 21.493 23.9508 22.0174C23.9463 22.5418 23.7361 23.0434 23.3657 23.4142C22.9953 23.785 22.4941 23.9954 21.9703 23.9999C21.4464 24.0045 20.9417 23.8029 20.5649 23.4386L11.9875 14.8526L3.41014 23.4386C3.03332 23.8029 2.52862 24.0045 2.00475 23.9999C1.48089 23.9954 0.979766 23.785 0.609323 23.4142C0.238879 23.0434 0.0287522 22.5418 0.0241999 22.0174C0.0196477 21.493 0.221035 20.9878 0.584985 20.6106L9.16235 12.0246L0.584985 3.43858C0.210419 3.06352 0 2.5549 0 2.02458C0 1.49425 0.210419 0.985632 0.584985 0.610577V0.610577Z",fill:"currentColor"})),Tr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"})),Mr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"}),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})),Vr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"})),Br=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M6.85715 10.2857C6.85715 9.3764 7.21837 8.50433 7.86135 7.86135C8.50433 7.21837 9.3764 6.85715 10.2857 6.85715H20.5714C21.4807 6.85715 22.3528 7.21837 22.9958 7.86135C23.6388 8.50433 24 9.3764 24 10.2857V20.5714C24 21.4807 23.6388 22.3528 22.9958 22.9958C22.3528 23.6388 21.4807 24 20.5714 24H10.2857C9.3764 24 8.50433 23.6388 7.86135 22.9958C7.21837 22.3528 6.85715 21.4807 6.85715 20.5714V10.2857Z",fill:"currentColor"}),r.createElement("path",{d:"M3.42857 0C2.51926 0 1.64719 0.361223 1.00421 1.00421C0.361223 1.64719 0 2.51926 0 3.42857V13.7143C0 14.6236 0.361223 15.4957 1.00421 16.1387C1.64719 16.7816 2.51926 17.1429 3.42857 17.1429V6.42857C3.42857 4.77172 4.77172 3.42857 6.42857 3.42857H17.1429C17.1429 2.51926 16.7816 1.64719 16.1387 1.00421C15.4957 0.361223 14.6236 0 13.7143 0H3.42857Z",fill:"currentColor"})),Pr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"})),Gr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"})),ke=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M11.2552 17.8659C11.6526 18.3095 12.3474 18.3095 12.7448 17.8659L22.5063 6.97001C23.0833 6.32597 22.6262 5.30274 21.7615 5.30274H2.2385C1.37381 5.30274 0.916704 6.32597 1.49369 6.97001L11.2552 17.8659Z",fill:"currentColor"})),zr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})),Hr=({title:e,titleId:t,...n})=>r.createElement("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6.41439 13.6844L12.0452 21.7082C12.1448 21.8501 12.3551 21.8501 12.4546 21.7081L18.0764 13.6884L12.4479 16.1153L12.25 16.2007L12.052 16.1153L6.41439 13.6844ZM6.12744 12.4717L12.25 15.1117L18.3441 12.4839L12.4655 2.37075C12.3693 2.20517 12.1302 2.20487 12.0336 2.3702L6.12744 12.4717Z",fill:"currentColor"})),jr=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.8}),r.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor",fillOpacity:.4}),r.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.8}),r.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor",fillOpacity:.4}),r.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor"}),r.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.8})),Or=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",fill:"currentColor",fillOpacity:.602}),r.createElement("path",{d:"M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",fill:"currentColor"}),r.createElement("path",{d:"M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",fill:"currentColor",fillOpacity:.602}),r.createElement("path",{d:"M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",fill:"currentColor"}),r.createElement("path",{d:"M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",fill:"currentColor",fillOpacity:.2}),r.createElement("path",{d:"M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",fill:"currentColor",fillOpacity:.602})),Fr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"})),Ze=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("rect",{width:24,height:24,rx:12,fill:"currentColor",fillOpacity:.15}),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M7.15726 7.17299C7.31622 7.01408 7.53178 6.92481 7.75654 6.92481C7.9813 6.92481 8.19686 7.01408 8.35581 7.17299L11.9947 10.8119L15.6336 7.17299C15.7118 7.09203 15.8053 7.02746 15.9087 6.98303C16.0121 6.93861 16.1234 6.91523 16.2359 6.91425C16.3485 6.91327 16.4601 6.93472 16.5642 6.97734C16.6684 7.01995 16.7631 7.08289 16.8426 7.16248C16.9222 7.24207 16.9852 7.33671 17.0278 7.44088C17.0704 7.54505 17.0919 7.65666 17.0909 7.76921C17.0899 7.88176 17.0665 7.99299 17.0221 8.0964C16.9777 8.19982 16.9131 8.29335 16.8321 8.37154L13.1932 12.0104L16.8321 15.6493C16.9865 15.8092 17.072 16.0233 17.07 16.2455C17.0681 16.4678 16.979 16.6804 16.8218 16.8375C16.6647 16.9947 16.4521 17.0838 16.2298 17.0858C16.0076 17.0877 15.7934 17.0023 15.6336 16.8479L11.9947 13.209L8.35581 16.8479C8.19595 17.0023 7.98184 17.0877 7.75959 17.0858C7.53734 17.0838 7.32475 16.9947 7.16759 16.8375C7.01043 16.6804 6.92129 16.4678 6.91935 16.2455C6.91742 16.0233 7.00286 15.8092 7.15726 15.6493L10.7961 12.0104L7.15726 8.37154C6.99836 8.21258 6.90909 7.99702 6.90909 7.77226C6.90909 7.5475 6.99836 7.33194 7.15726 7.17299V7.17299Z",fill:"currentColor"})),Dr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"})),Ar=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("g",{clipPath:"url(#clip0_3998_6392)"},r.createElement("path",{d:"M7.05947 19.9737C7.25483 20.0776 7.46091 19.8527 7.3413 19.6665C6.69208 18.6561 6.07731 16.9559 7.05679 14.7661C8.69019 11.1146 9.68411 9.22335 9.68411 9.22335C9.68411 9.22335 10.2128 11.4304 11.6458 13.3928C13.0251 15.2815 13.78 17.6568 12.563 19.6356C12.4488 19.8213 12.6502 20.0404 12.8442 19.9411C14.3508 19.1705 16.0405 17.6246 16.2312 14.5484C16.3015 13.6084 16.1961 12.2924 15.6689 10.6317C14.9911 8.52692 14.1578 7.54479 13.6757 7.12302C13.5315 6.99685 13.3072 7.10868 13.319 7.29992C13.4595 9.57097 12.6051 10.1473 12.1188 8.84848C11.9246 8.32973 11.8113 7.43247 11.8113 6.33979C11.8113 4.52067 11.2836 2.64805 10.12 1.12635C9.81741 0.730628 9.46336 0.360856 9.05715 0.0455287C8.91009 -0.0686545 8.69692 0.0461169 8.71038 0.231804C8.79973 1.46501 8.71878 4.9993 5.61809 9.22165C2.80668 13.1384 3.8961 16.1464 4.28267 16.9611C5.02175 18.5218 6.05267 19.4384 7.05947 19.9737Z",fill:"currentColor",fillOpacity:.4})),r.createElement("defs",null,r.createElement("clipPath",{id:"clip0_3998_6392"},r.createElement("rect",{width:20,height:20,fill:"white"})))),Zr=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("g",{clipPath:"url(#clip0_3998_6392)"},r.createElement("path",{d:"M7.05947 19.9737C7.25483 20.0776 7.46091 19.8527 7.3413 19.6665C6.69208 18.6561 6.07731 16.9559 7.05679 14.7661C8.69019 11.1146 9.68411 9.22335 9.68411 9.22335C9.68411 9.22335 10.2128 11.4304 11.6458 13.3928C13.0251 15.2815 13.78 17.6568 12.563 19.6356C12.4488 19.8213 12.6502 20.0404 12.8442 19.9411C14.3508 19.1705 16.0405 17.6246 16.2312 14.5484C16.3015 13.6084 16.1961 12.2924 15.6689 10.6317C14.9911 8.52692 14.1578 7.54479 13.6757 7.12302C13.5315 6.99685 13.3072 7.10868 13.319 7.29992C13.4595 9.57097 12.6051 10.1473 12.1188 8.84848C11.9246 8.32973 11.8113 7.43247 11.8113 6.33979C11.8113 4.52067 11.2836 2.64805 10.12 1.12635C9.81741 0.730628 9.46336 0.360856 9.05715 0.0455287C8.91009 -0.0686545 8.69692 0.0461169 8.71038 0.231804C8.79973 1.46501 8.71878 4.9993 5.61809 9.22165C2.80668 13.1384 3.8961 16.1464 4.28267 16.9611C5.02175 18.5218 6.05267 19.4384 7.05947 19.9737Z",fill:"currentColor",fillOpacity:1})),r.createElement("defs",null,r.createElement("clipPath",{id:"clip0_3998_6392"},r.createElement("rect",{width:20,height:20,fill:"white"})))),Wr=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("rect",{width:24,height:24,fill:"url(#paint0_linear_2_3)"}),r.createElement("defs",null,r.createElement("linearGradient",{id:"paint0_linear_2_3",x1:15.986,y1:26.8444,x2:-7.34084,y2:-14.214,gradientUnits:"userSpaceOnUse"},r.createElement("stop",{stopColor:"#44BCF0"}),r.createElement("stop",{offset:.378795,stopColor:"#7298F8"}),r.createElement("stop",{offset:1,stopColor:"#A099FF"})))),Nr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"})),Ir=({title:e,titleId:t,...n})=>r.createElement("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M4.85714 2C4.09938 2 3.37266 2.30102 2.83684 2.83684C2.30102 3.37266 2 4.09938 2 4.85714V7.71429C2 8.47205 2.30102 9.19877 2.83684 9.73459C3.37266 10.2704 4.09938 10.5714 4.85714 10.5714H7.71429C8.47205 10.5714 9.19877 10.2704 9.73459 9.73459C10.2704 9.19877 10.5714 8.47205 10.5714 7.71429V4.85714C10.5714 4.09938 10.2704 3.37266 9.73459 2.83684C9.19877 2.30102 8.47205 2 7.71429 2H4.85714ZM4.85714 13.4286C4.09938 13.4286 3.37266 13.7296 2.83684 14.2654C2.30102 14.8012 2 15.528 2 16.2857V19.1429C2 19.9006 2.30102 20.6273 2.83684 21.1632C3.37266 21.699 4.09938 22 4.85714 22H7.71429C8.47205 22 9.19877 21.699 9.73459 21.1632C10.2704 20.6273 10.5714 19.9006 10.5714 19.1429V16.2857C10.5714 15.528 10.2704 14.8012 9.73459 14.2654C9.19877 13.7296 8.47205 13.4286 7.71429 13.4286H4.85714ZM13.4286 4.85714C13.4286 4.09938 13.7296 3.37266 14.2654 2.83684C14.8012 2.30102 15.528 2 16.2857 2H19.1429C19.9006 2 20.6273 2.30102 21.1632 2.83684C21.699 3.37266 22 4.09938 22 4.85714V7.71429C22 8.47205 21.699 9.19877 21.1632 9.73459C20.6273 10.2704 19.9006 10.5714 19.1429 10.5714H16.2857C15.528 10.5714 14.8012 10.2704 14.2654 9.73459C13.7296 9.19877 13.4286 8.47205 13.4286 7.71429V4.85714ZM13.4286 16.2857C13.4286 15.528 13.7296 14.8012 14.2654 14.2654C14.8012 13.7296 15.528 13.4286 16.2857 13.4286H19.1429C19.9006 13.4286 20.6273 13.7296 21.1632 14.2654C21.699 14.8012 22 15.528 22 16.2857V19.1429C22 19.9006 21.699 20.6273 21.1632 21.1632C20.6273 21.699 19.9006 22 19.1429 22H16.2857C15.528 22 14.8012 21.699 14.2654 21.1632C13.7296 20.6273 13.4286 19.9006 13.4286 19.1429V16.2857Z",fill:"currentColor"})),_r=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"})),ct=({title:e,titleId:t,...n})=>r.createElement("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M12 5.25C12.8284 5.25 13.5 5.92157 13.5 6.75V6.75583C13.5 7.58426 12.8284 8.25583 12 8.25583C11.1716 8.25583 10.5 7.58426 10.5 6.75583V6.75C10.5 5.92157 11.1716 5.25 12 5.25Z",fill:"currentColor"}),r.createElement("path",{d:"M10.5 9.5C9.67157 9.5 9 10.1716 9 11C9 11.8284 9.67157 12.5 10.5 12.5V17C10.5 17.8284 11.1716 18.5 12 18.5C12.8284 18.5 13.5 17.8284 13.5 17L13.5 11C13.5 10.1716 12.8284 9.5 12 9.5H10.5Z",fill:"currentColor"}),r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z",fill:"currentColor"})),Ur=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})),Yr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 6h16M4 10h16M4 14h16M4 18h16"})),qr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})),Xr=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M4.00058 9.70969C4.23776 10.2167 4.82477 11.2188 4.82477 11.2188L11.611 0L4.98783 4.62508C4.59318 4.88836 4.2694 5.24473 4.04505 5.66275C3.7434 6.29338 3.58313 6.98229 3.57545 7.68131C3.56777 8.38033 3.71286 9.07259 4.00058 9.70969Z",fill:"#5298FF"}),r.createElement("path",{d:"M1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038Z",fill:"#5298FF"}),r.createElement("path",{d:"M20.0011 14.2903C19.7639 13.7833 19.1769 12.7812 19.1769 12.7812L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903Z",fill:"#5298FF"}),r.createElement("path",{d:"M22.69 10.5962C22.6153 9.52304 22.3121 8.47827 21.8008 7.53183C21.2895 6.58539 20.5819 5.75911 19.7253 5.10834L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962Z",fill:"#5298FF"}),r.createElement("path",{d:"M4.04505 5.66275C4.2694 5.24473 4.59318 4.88836 4.98783 4.62508L11.611 0L4.82476 11.2217C4.82476 11.2217 4.23182 10.2196 4.00057 9.71266C3.7124 9.07515 3.56707 8.38236 3.57475 7.68278C3.58243 6.98321 3.74296 6.29378 4.04505 5.66275ZM1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038ZM19.9892 14.2933C19.752 13.7863 19.165 12.7842 19.165 12.7842L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903L19.9892 14.2933ZM22.6782 10.5991C22.6034 9.526 22.3002 8.48124 21.7889 7.53479C21.2776 6.58835 20.57 5.76208 19.7135 5.1113L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962L22.6782 10.5991Z",fill:"#5298FF"})),Kr=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M1.5 3.1579H22.5",stroke:"currentColor",strokeLinecap:"round"}),r.createElement("path",{d:"M1.5 12H22.5",stroke:"currentColor",strokeLinecap:"round"}),r.createElement("path",{d:"M1.5 20.8421H22.5",stroke:"currentColor",strokeLinecap:"round"})),Jr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"})),Qr=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"})),en=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 4v16m8-8H4"})),tn=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 6v6m0 0v6m0-6h6m-6 0H6"})),rn=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"})),nn=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})),on=({title:e,titleId:t,...n})=>r.createElement("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M21 3.00006L15 9.00006L12 12.0001H3M15 3.00006H21H15ZM21 3.00006V9.00006V3.00006Z",strokeLinecap:"round",strokeLinejoin:"round"}),r.createElement("path",{d:"M21 21.0001L15 15.0001M15 21.0001H21H15ZM21 21.0001V15.0001V21.0001Z",strokeLinecap:"round",strokeLinejoin:"round"})),an=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"})),sn=({title:e,titleId:t,...n})=>r.createElement("svg",{width:"1em",height:"1em",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M10 5C9.34339 5 8.69321 5.12933 8.08658 5.3806C7.47995 5.63188 6.92876 6.00017 6.46447 6.46447C6.00017 6.92876 5.63188 7.47995 5.3806 8.08658C5.12933 8.69321 5 9.34339 5 10C5 10.6566 5.12933 11.3068 5.3806 11.9134C5.63188 12.52 6.00017 13.0712 6.46447 13.5355C6.63214 13.7032 6.81114 13.8584 7 14C7 13.0807 7.18106 12.1705 7.53284 11.3212C7.88463 10.4719 8.40024 9.70026 9.05025 9.05025C9.70026 8.40024 10.4719 7.88463 11.3212 7.53284C12.1705 7.18106 13.0807 7 14 7C14 7 14 7 14 7C13.8589 6.81181 13.7038 6.63276 13.5355 6.46447C12.5979 5.52678 11.3261 5 10 5ZM16.5277 7.47231C16.1793 6.57251 15.6452 5.74574 14.9497 5.05025C13.637 3.7375 11.8565 3 10 3C9.08075 3 8.1705 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C4.40024 5.70026 3.88463 6.47194 3.53284 7.32122C3.18106 8.1705 3 9.08075 3 10C3 10.9193 3.18106 11.8295 3.53284 12.6788C3.88463 13.5281 4.40024 14.2997 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C7.37137 16.4879 7.42174 16.5081 7.47231 16.5277C7.49189 16.5783 7.51207 16.6286 7.53284 16.6788C7.88463 17.5281 8.40024 18.2997 9.05025 18.9497C9.70026 19.5998 10.4719 20.1154 11.3212 20.4672C12.1705 20.8189 13.0807 21 14 21C15.8565 21 17.637 20.2625 18.9497 18.9497C20.2625 17.637 21 15.8565 21 14C21 12.1435 20.2625 10.363 18.9497 9.05025C18.2543 8.35477 17.4275 7.82074 16.5277 7.47231ZM12.0866 9.3806C12.6932 9.12933 13.3434 9 14 9C15.3261 9 16.5979 9.52678 17.5355 10.4645C18.4732 11.4021 19 12.6739 19 14C19 15.3261 18.4732 16.5979 17.5355 17.5355C16.5979 18.4732 15.3261 19 14 19C13.3434 19 12.6932 18.8707 12.0866 18.6194C11.48 18.3681 10.9288 17.9998 10.4645 17.5355C10.0002 17.0712 9.63188 16.52 9.3806 15.9134C9.12933 15.3068 9 14.6566 9 14C9 13.3434 9.12933 12.6932 9.3806 12.0866C9.63188 11.48 10.0002 10.9288 10.4645 10.4645C10.9288 10.0002 11.48 9.63188 12.0866 9.3806Z",fill:"currentColor"})),ln=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"})),cn=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"})),dn=({title:e,titleId:t,...n})=>r.createElement("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 10.4C12.7956 10.4 13.5587 10.0629 14.1213 9.46274C14.6839 8.86263 15 8.04869 15 7.2C15 6.35131 14.6839 5.53737 14.1213 4.93726C13.5587 4.33714 12.7956 4 12 4C11.2044 4 10.4413 4.33714 9.87868 4.93726C9.31607 5.53737 9 6.35131 9 7.2C9 8.04869 9.31607 8.86263 9.87868 9.46274C10.4413 10.0629 11.2044 10.4 12 10.4ZM5 20C5 19.0195 5.18106 18.0485 5.53284 17.1426C5.88463 16.2367 6.40024 15.4136 7.05025 14.7203C7.70026 14.0269 8.47194 13.4769 9.32122 13.1017C10.1705 12.7265 11.0807 12.5333 12 12.5333C12.9193 12.5333 13.8295 12.7265 14.6788 13.1017C15.5281 13.4769 16.2997 14.0269 16.9497 14.7203C17.5998 15.4136 18.1154 16.2367 18.4672 17.1426C18.8189 18.0485 19 19.0195 19 20H5Z",fill:"currentColor"})),un=({title:e,titleId:t,...n})=>r.createElement("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{d:"M11 8C11 8.79565 10.6839 9.55871 10.1213 10.1213C9.55871 10.6839 8.79565 11 8 11C7.20435 11 6.44129 10.6839 5.87868 10.1213C5.31607 9.55871 5 8.79565 5 8C5 7.20435 5.31607 6.44129 5.87868 5.87868C6.44129 5.31607 7.20435 5 8 5C8.79565 5 9.55871 5.31607 10.1213 5.87868C10.6839 6.44129 11 7.20435 11 8ZM19 8C19 8.39397 18.9224 8.78407 18.7716 9.14805C18.6209 9.51203 18.3999 9.84274 18.1213 10.1213C17.8427 10.3999 17.512 10.6209 17.1481 10.7716C16.7841 10.9224 16.394 11 16 11C15.606 11 15.2159 10.9224 14.8519 10.7716C14.488 10.6209 14.1573 10.3999 13.8787 10.1213C13.6001 9.84274 13.3791 9.51203 13.2284 9.14805C13.0776 8.78407 13 8.39397 13 8C13 7.20435 13.3161 6.44129 13.8787 5.87868C14.4413 5.31607 15.2044 5 16 5C16.7956 5 17.5587 5.31607 18.1213 5.87868C18.6839 6.44129 19 7.20435 19 8ZM14.93 19C14.976 18.673 15 18.34 15 18C15.0023 16.4289 14.4737 14.903 13.5 13.67C14.2601 13.2312 15.1223 13.0001 16 13.0001C16.8776 13.0001 17.7399 13.2311 18.4999 13.67C19.26 14.1088 19.8912 14.74 20.3301 15.5C20.7689 16.2601 21 17.1223 21 18V19H14.93ZM8 13C9.32608 13 10.5979 13.5268 11.5355 14.4645C12.4732 15.4021 13 16.6739 13 18V19H3V18C3 16.6739 3.52678 15.4021 4.46447 14.4645C5.40215 13.5268 6.67392 13 8 13Z",fill:"currentColor"})),gn=({title:e,titleId:t,...n})=>r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",width:"1em",height:"1em",focusable:"false",shapeRendering:"geometricPrecision","aria-labelledby":t,...n},e?r.createElement("title",{id:t},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"})),Yo=u.default.div(()=>o.css`
    position: relative;
  `),qo=u.default.div(({theme:e,$disabled:t,$size:n})=>o.css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;

    color: ${e.colors.accent};

    ${t&&o.css`
      color: ${e.colors.textPlaceholder};
    `}

    #countdown-complete-check {
      stroke-width: ${e.borderWidths["1.5"]};
      overflow: visible;
      display: block;
    }

    ${()=>{switch(n){case"small":return o.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
          `;case"large":return o.css`
            font-size: ${e.fontSizes.extraLarge};
            margin-top: -${e.space["0.5"]};
            height: ${e.space[24]};
            width: ${e.space[24]};
          `;default:return""}}}
  `),Xo=u.default.div(({theme:e,$disabled:t,$size:n,$color:a})=>o.css`
    stroke: ${e.colors.accent};

    color: ${e.colors[a]};

    ${t&&o.css`
      color: ${e.colors.foregroundSecondary};
    `}

    ${()=>{switch(n){case"small":return o.css`
            height: ${e.space[16]};
            width: ${e.space[16]};
            stroke-width: ${e.space[1]};
          `;case"large":return o.css`
            height: ${e.space[24]};
            width: ${e.space[24]};
            stroke-width: ${e.space[1]};
          `;default:return""}}}
  `),Ko=u.default.circle(({$finished:e})=>o.css`
    transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

    ${e&&o.css`
      stroke-width: 0;
    `}
  `),dt=r.forwardRef(({accessibilityLabel:e,color:t="textSecondary",size:n="small",countdownSeconds:a,startTimestamp:s,disabled:i,callback:l,...c},d)=>{const f=r.useMemo(()=>Math.ceil((s||Date.now())/1e3),[s]),m=r.useMemo(()=>f+a,[f,a]),b=r.useCallback(()=>Math.max(m-Math.ceil(Date.now()/1e3),0),[m]),[$,p]=r.useState(a);return r.useEffect(()=>{if(!i){p(b());const E=setInterval(()=>{const C=b();C===0&&(clearInterval(E),l&&l()),p(C)},1e3);return()=>clearInterval(E)}},[b,l,a,i]),r.createElement(Yo,{...c,"data-testid":ee(c,"countdown-circle")},r.createElement(qo,{$size:n,$disabled:i},i&&a,!i&&($>0?$:r.createElement(it,{"data-testid":"countdown-complete-check",id:"countdown-complete-check"}))),r.createElement(Xo,{$color:t,$disabled:i,$size:n,ref:d},e&&r.createElement(J,null,e),r.createElement("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},r.createElement(Ko,{$finished:$===0,cx:"12",cy:"12",fill:"none",r:"9",strokeDasharray:`${48*($/a)}, 56`,strokeLinecap:"round"}),r.createElement("circle",{cx:"12",cy:"12",fill:"none",opacity:i?"1":"0.25",r:"9",strokeLinecap:"round"}))))});dt.displayName="CountdownCircle";const Jo=u.default.div(()=>o.css`
    max-width: max-content;
    position: relative;
  `),Qo=u.default.div(({theme:e,$opened:t,$inner:n,$shortThrow:a,$align:s,$labelAlign:i,$direction:l})=>o.css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;

    ${l==="up"&&o.css`
      bottom: 100%;
    `}

    ${i&&o.css`
      & > button {
        justify-content: ${i};
      }
    `}

    ${t?o.css`
          visibility: visible;
          opacity: 1;
        `:o.css`
          z-index: 1;
          visibility: hidden;
          opacity: 0;
        `}

    padding: ${e.space["1.5"]};
    background-color: ${e.colors.groupBackground};
    box-shadow: ${e.boxShadows["0.02"]};
    border-radius: ${e.radii["2xLarge"]};

    ${n&&o.css`
      background-color: ${e.colors.grey};
      border-radius: ${e.radii.almostExtraLarge};
      border-${l==="down"?"top":"bottom"}-left-radius: none;
      border-${l==="down"?"top":"bottom"}-right-radius: none;
      box-shadow: 0;
      border-width: ${e.space.px};
      border-${l==="down"?"top":"bottom"}-width: 0;
      border-color: ${e.colors.borderSecondary};
      padding: 0 ${e.space["1.5"]};
      padding-${l==="down"?"top":"bottom"}: ${e.space["2.5"]};
      padding-${l==="down"?"bottom":"top"}: ${e.space["1.5"]};
      margin-${l==="down"?"top":"bottom"}: -${e.space["2.5"]};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
    `}

    ${()=>t?o.css`
          transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
            z-index 0s linear 0.35s;
        `:o.css`
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
          z-index 0s linear 0s;
      `}

    ${()=>{if(!t&&!a)return o.css`
          margin-${l==="down"?"top":"bottom"}: calc(-1 * ${e.space[12]});
        `;if(!t&&a)return o.css`
          margin-${l==="down"?"top":"bottom"}: calc(-1 * ${e.space["2.5"]});
        `;if(t&&!n)return o.css`
          z-index: 20;
          margin-${l==="down"?"top":"bottom"}: ${e.space["1.5"]};
        `}}

  ${s==="left"?o.css`
          left: 0;
        `:o.css`
          right: 0;
        `}
  `),Ot=u.default.button(({theme:e,$inner:t,$hasColor:n,$color:a,disabled:s})=>o.css`
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: ${e.space[4]};
    width: ${e.space.full};
    height: ${e.space[12]};
    padding: ${e.space[3]};
    font-weight: ${e.fontWeights.semiBold};
    transition-duration: 0.15s;
    transition-property: color, transform, filter;
    transition-timing-function: ease-in-out;
    letter-spacing: -0.01em;

    &:active {
      transform: translateY(0px);
      filter: brightness(1);
    }

    color: ${e.colors[a||"accent"]};

    ${s&&o.css`
      color: ${e.colors.textTertiary};
      cursor: not-allowed;
    `}

    ${()=>{if(t)return o.css`
          justify-content: center;

          &:hover {
            color: ${e.colors.accent};
          }
        `;if(!t)return o.css`
          justify-content: flex-start;

          &:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
          }
        `}}

    ${()=>{if(t&&!n)return o.css`
          color: ${e.colors.textSecondary};
        `}}
  `),ea=({setIsOpen:e,item:t})=>{const n=r.useRef(null),a=r.cloneElement(t,{...t.props,ref:n}),s=r.useCallback(()=>{e(!1)},[e]);return r.useEffect(()=>{const i=n.current;return i==null||i.addEventListener("click",s),()=>{i==null||i.removeEventListener("click",s)}},[s,t]),a},ta=({items:e,setIsOpen:t,isOpen:n,width:a,inner:s,align:i,shortThrow:l,keepMenuOnTop:c,labelAlign:d,direction:f})=>r.createElement(Qo,{$opened:n,$inner:s,$align:i,$shortThrow:l,$labelAlign:d,$direction:f,style:{width:s||a&&parseInt(a)>100?`${a}px`:"150px",zIndex:c?100:void 0}},e.map(m=>{if(r.isValidElement(m))return ea({item:m,setIsOpen:t});const{color:b,value:$,label:p,onClick:E,disabled:C,as:v,wrapper:S}=m,h={$inner:s,$hasColor:!!b,$color:b,disabled:C,onClick:()=>{t(!1),E==null||E($)},as:v,children:p};return S?S(r.createElement(Ot,{...h,type:"button"}),$||p):r.createElement(Ot,{...h,key:$||p,type:"button"})})),ra=u.default.button(({theme:e,$size:t,$open:n,$direction:a})=>o.css`
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${e.space[4]};
    border-width: ${e.space.px};
    font-weight: ${e.fontWeights.semiBold};
    cursor: pointer;
    position: relative;
    border-color: ${e.colors.borderSecondary};

    ${()=>{switch(t){case"small":return o.css`
            padding: ${e.space["0.5"]} ${e.space["0.25"]};
          `;case"medium":return o.css`
            padding: ${e.space["2.5"]} ${e.space["3.5"]};
          `;default:return""}}}

    ${()=>{if(n)return o.css`
          border-${a==="down"?"top":"bottom"}-left-radius: ${e.radii.almostExtraLarge};
          border-${a==="down"?"top":"bottom"}-right-radius: ${e.radii.almostExtraLarge};
          border-${a==="down"?"bottom":"top"}-left-radius: none;
          border-${a==="down"?"bottom":"top"}-right-radius: none;
          border-${a==="down"?"bottom":"top"}-width: 0;
          background-color: ${e.colors.grey};
          color: ${e.colors.textTertiary};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.3s color ease-in-out, 0.2s border-radius ease-in-out,
            0s border-width 0.1s, 0s padding linear;

          &:hover {
            color: ${e.colors.accent};
          }
        `;if(!n)return o.css`
          background-color: ${e.colors.background};
          color: ${e.colors.textSecondary};
          border-radius: ${e.radii.almostExtraLarge};
          box-shadow: ${e.boxShadows["0.02"]};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.15s color ease-in-out, 0s border-width 0.15s,
            0.15s border-color ease-in-out, 0s padding linear;

          &:hover {
            border-color: ${e.colors.border};
          }
        `}}
  `),Ft=u.default(ke)(({theme:e,$open:t,$direction:n})=>o.css`
    margin-left: ${e.space[1]};
    width: ${e.space[3]};
    margin-right: ${e.space["0.5"]};
    transition-duration: ${e.transitionDuration[200]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    opacity: 0.3;
    transform: rotate(${n==="down"?"0deg":"180deg"});
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${t&&o.css`
      opacity: 1;
      transform: rotate(${n==="down"?"180deg":"0deg"});
    `}
  `),na=u.default.div(()=>o.css`
    z-index: 10;
    position: relative;
  `),We=({children:e,buttonProps:t,items:n=[],inner:a=!1,chevron:s=!0,align:i="left",menuLabelAlign:l,shortThrow:c=!1,keepMenuOnTop:d=!1,size:f="medium",label:m,direction:b="down",isOpen:$,setIsOpen:p,...E})=>{const C=r.useRef(),[v,S]=r.useState(!1),[h,x]=p?[$,p]:[v,S],g=k=>{C.current&&!C.current.contains(k.target)&&x(!1)};return r.useEffect(()=>(h?document.addEventListener("mousedown",g):document.removeEventListener("mousedown",g),()=>{document.removeEventListener("mousedown",g)}),[C,h]),r.createElement(Jo,{ref:C,...E,"data-testid":ee(E,"dropdown")},!e&&a&&r.createElement(ra,{$direction:b,$open:h,$size:f,type:"button",onClick:()=>x(!h)},m,s&&r.createElement(Ft,{$direction:b,$open:h})),!e&&!a&&r.createElement(na,null,r.createElement(je,{...t,pressed:h,suffix:s&&r.createElement(Ft,{$direction:b,$open:h}),onClick:()=>x(!h)},m)),r.Children.map(e,k=>{if(r.isValidElement(k))return r.cloneElement(k,{...t,zindex:10,onClick:()=>x(!h)})}),r.createElement(ta,{align:i,direction:b,inner:a,isOpen:h,items:n,keepMenuOnTop:d,labelAlign:l,setIsOpen:x,shortThrow:c,width:C.current&&C.current.getBoundingClientRect().width.toFixed(2)}))};We.displayName="Dropdown";const oa=u.default.fieldset(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),aa=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[1]};
    padding: 0 ${e.space[4]};
  `),sa=u.default.div(({theme:e})=>o.css`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${e.space[3]};
  `),ia=u.default.div(({theme:e})=>o.css`
    color: ${e.colors.textSecondary};
    font-size: ${e.fontSizes.base};
  `),la=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    gap: ${e.space[4]};
  `),ut=({children:e,description:t,disabled:n,form:a,legend:s,name:i,status:l,...c})=>{let d,f;switch(l){case"complete":{d="Complete",f="green";break}case"required":case"pending":{d=l==="pending"?"Pending":"Required",f="accent";break}case"optional":{d="Optional",f="secondary";break}}return typeof l=="object"&&(d=l.name,f=l.tone),r.createElement(oa,{...c,disabled:n,form:a,name:i},r.createElement(aa,null,r.createElement(sa,null,r.createElement(Fe,{as:"legend",level:"2",responsive:!0},s),f&&d&&r.createElement(Ae,{tone:f},d)),r.createElement(ia,null,t)),r.createElement(la,null,e))};ut.displayName="FieldSet";const ca=u.default.div(({theme:e,$type:t,$alignment:n})=>o.css`
    width: ${e.space.full};
    padding: ${e.space[6]} ${e.space[4]};

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: ${e.space[2]};
    border-radius: ${e.radii.large};

    text-align: center;
    overflow-x: auto;

    ${n==="horizontal"&&o.css`
      flex-direction: row;
      justify-content: flex-start;
      gap: ${e.space[4]};
      padding: ${e.space[4]};
      text-align: left;
    `}

    background-color: ${e.colors.lightBlue};
    border: ${e.borderWidths.px} solid ${e.colors.blue};

    ${t==="warning"&&o.css`
      background-color: ${e.colors.lightYellow};
      border-color: ${e.colors.yellow};
    `}

    ${t==="error"&&o.css`
      background-color: ${e.colors.lightRed};
      border-color: ${e.colors.red};
    `}
  `),da=u.default.div(({theme:e,$type:t})=>o.css`
    width: ${e.space[6]};
    height: ${e.space[6]};

    color: ${e.colors.blue};

    ${t==="warning"&&o.css`
      color: ${e.colors.yellow};
    `}
    ${t==="error"&&o.css`
      color: ${e.colors.red};
    `}
  `),gt=({type:e="info",alignment:t="vertical",children:n,...a})=>{const s=e==="info"?ct:at;return r.createElement(ca,{$alignment:t,$type:e,...a},r.createElement(da,{$type:e,as:s}),n)};gt.displayName="Helper";const Xe=(e,t,n)=>typeof n=="string"?n:(n==null?void 0:n[e])||t,ua=u.default.div(({theme:e,$size:t,$disabled:n,$error:a,$suffix:s,$userStyles:i,$validated:l,$showDot:c})=>o.css`
    position: relative;
    background-color: ${e.colors.backgroundSecondary};
    border-radius: ${e.radii["2xLarge"]};
    border-width: ${e.space["0.75"]};
    border-color: ${e.colors.transparent};
    color: ${e.colors.text};
    display: flex;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: color, border-color, background-color;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    box-sizing: content-box;
    background-clip: content-box;

    :after {
      content: '';
      position: absolute;
      width: ${e.space[4]};
      height: ${e.space[4]};
      box-sizing: border-box;
      border-radius: 50%;
      right: 0;
      top: 0;
      transition: all 0.3s ease-out;
      ${()=>a&&c?o.css`
            background-color: ${e.colors.red};
            border: 2px solid ${e.colors.white};
            transform: translate(50%, -50%) scale(1);
          `:l&&c?o.css`
            background-color: ${e.colors.green};
            border: 2px solid ${e.colors.white};
            transform: translate(50%, -50%) scale(1);
          `:o.css`
          background-color: ${e.colors.transparent};
          border: 2px solid ${e.colors.transparent};
          transform: translate(50%, -50%) scale(0.2);
        `}
    }

    &:focus-within {
      ${!a&&o.css`
        border-color: ${e.colors.accentSecondary};
      `}
    }

    &:focus-within::after {
      ${!a&&c&&o.css`
        background-color: ${e.colors.blue};
        border-color: ${e.colors.white};
        transform: translate(50%, -50%) scale(1);
      `}
    }

    ${n&&o.css`
      border-color: ${e.colors.foregroundSecondary};
      background-color: ${e.colors.background};
    `}

    ${a&&o.css`
      border-color: ${e.colors.red};
      cursor: default;
    `}

  ${s&&o.css`
      height: ${e.space[16]};
    `}

  ${()=>{switch(t){case"medium":return o.css`
            height: ${e.space[14]};
          `;case"large":return o.css`
            height: ${e.space[16]};
          `;case"extraLarge":return o.css`
            height: ${e.space[18]};
          `;default:return""}}}
  ${i}
  `),ga=u.default.label(({theme:e,$padding:t})=>o.css`
    align-items: center;
    display: flex;
    height: ${e.space.full};
    line-height: normal;
    color: inherit;
    font-family: ${e.fonts.sans};
    font-weight: ${e.fontWeights.medium};
    padding-left: ${e.space[t]};
  `),fa=u.default.label(({theme:e,$padding:t})=>o.css`
    align-items: center;
    display: flex;
    height: ${e.space.full};
    line-height: normal;
    color: inherit;
    font-family: ${e.fonts.sans};
    font-weight: ${e.fontWeights.medium};
    padding-right: ${e.space[t]};
  `),pa=u.default.div(({theme:e})=>o.css`
    overflow: hidden;
    position: relative;
    width: ${e.space.full};
  `),ba=u.default.input(({theme:e,disabled:t,type:n,$size:a,$padding:s})=>o.css`
    background-color: ${e.colors.transparent};
    position: relative;
    width: ${e.space.full};
    height: ${e.space.full};
    padding: 0 ${e.space[s]};
    font-weight: ${e.fontWeights.medium};
    text-overflow: ellipsis;

    &::placeholder {
      color: ${e.colors.textPlaceholder};
      font-weight: ${e.fontWeights.medium};
    }

    ${t&&o.css`
      opacity: ${e.opacity[50]};
      cursor: not-allowed;
    `}

    ${n==="number"&&o.css`
      font-feature-settings: 'kern' 1, 'tnum' 1, 'calt' 0;
      font-variant-numeric: tabular-nums;
    `}

  ${()=>{switch(a){case"medium":return o.css`
            font-size: ${e.fontSizes.base};
          `;case"large":return o.css`
            font-size: ${e.fontSizes.large};
          `;case"extraLarge":return o.css`
            font-size: ${e.fontSizes.headingThree};
          `;default:return""}}}
  `),$a=u.default.div(({theme:e,$type:t,$size:n})=>o.css`
    inset: 0;
    position: absolute;
    pointer-events: none;
    white-space: pre;
    line-height: normal;
    display: flex;
    align-items: center;

    padding: 0 ${e.space[4]};
    border-color: ${e.colors.transparent};

    ${t==="number"&&o.css`
      font-feature-settings: 'kern' 1, 'tnum' 1, 'calt' 0;
      font-variant-numeric: tabular-nums;
    `}

    ${()=>{switch(n){case"medium":return o.css`
            font-size: ${e.fontSizes.base};
          `;case"large":return o.css`
            font-size: ${e.fontSizes.large};
          `;case"extraLarge":return o.css`
            font-size: ${e.fontSizes.headingThree};
            padding: 0 ${e.space[6]};
          `;default:return""}}}
  `),ma=u.default.span(({theme:e})=>o.css`
    color: ${e.colors.text};
    font-weight: ${e.fontWeights.medium};
  `),ft=r.forwardRef(({autoFocus:e,autoComplete:t="off",autoCorrect:n,defaultValue:a,description:s,disabled:i,error:l,validated:c,showDot:d,hideLabel:f,id:m,inputMode:b,label:$,labelSecondary:p,labelPlacement:E,name:C,placeholder:v,prefix:S,prefixAs:h,readOnly:x,required:g,spellCheck:k,suffix:y,suffixAs:T,tabIndex:R,type:L="text",units:z,value:j,width:O,onBlur:Z,onChange:A,onFocus:se,onKeyDown:M,size:P="medium",parentStyles:F,padding:ie,...Ne},te)=>{const W=r.useRef(null),$e=te||W,[me,re]=r.useState({ghostValue:j||a}),ue=v?`${v!=null?v:""}${z?` ${z}`:""}`:void 0,le=l?!0:void 0,ge=L==="email"?"text":L,ce=r.useCallback(D=>{const oe=D.target.value;re(Y=>({...Y,ghostValue:oe}))},[]),Se=r.useCallback(D=>{if(L==="number"){const oe=D.key;["E","e","+"].includes(oe)&&D.preventDefault()}M&&M(D)},[L,M]),X=r.useCallback(D=>{var oe;(oe=D.target)==null||oe.blur()},[]),we=Xe("prefix","4",ie),ne=Xe("input",P==="extraLarge"?"6":"4",ie),fe=Xe("suffix","2",ie);return r.createElement(Q,{description:s,error:l,hideLabel:f,id:m,label:$,labelPlacement:E,labelSecondary:p,required:g,width:O},D=>r.createElement(ua,{$disabled:i,$error:le,$validated:c,$showDot:d,$suffix:y!==void 0,$size:P,$userStyles:F},S&&r.createElement(ga,{"aria-hidden":"true",as:h,...D==null?void 0:D.label,$padding:we},S),r.createElement(pa,null,r.createElement(ba,{ref:$e,...Ne,...D==null?void 0:D.content,"aria-invalid":le,onInput:ce,onKeyDown:L==="number"?Se:M,onWheel:L==="number"?X:void 0,$padding:ne,$size:P,autoComplete:t,autoCorrect:n,autoFocus:e,defaultValue:a,disabled:i,inputMode:b,name:C,placeholder:ue,readOnly:x,spellCheck:k,tabIndex:R,type:ge,value:j,onBlur:Z,onChange:A,onFocus:se}),z&&me.ghostValue&&r.createElement($a,{$size:P,$type:ge,"aria-hidden":"true","data-testid":"ghost"},r.createElement("span",{style:{visibility:"hidden"}},me.ghostValue," "),r.createElement(ma,null,z))),y&&r.createElement(fa,{"aria-hidden":"true",as:T,...D==null?void 0:D.label,$padding:fe},y)))});ft.displayName="Input";const wa=u.default.div(({theme:e,$state:t})=>o.css`
    width: 95%;

    position: fixed;
    left: 2.5%;
    z-index: 9999;
    bottom: ${e.space[4]};

    display: flex;
    flex-direction: row;

    ${U.sm.min(o.css`
      width: min-content;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      bottom: initial;
    `)}

    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${t==="entered"?o.css`
          opacity: 1;
          transform: translateY(0px);
        `:o.css`
          opacity: 0;
          transform: translateY(128px);
        `}
  `),Ee=({children:e,backdropSurface:t,onDismiss:n,open:a,...s})=>r.createElement(xe,{open:a,surface:t,onDismiss:n},({state:i})=>r.createElement(wa,{$state:i,...s},e));Ee.displayName="Modal";const ha=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
    flex-gap: ${e.space[2]};
  `),Ca=u.default.button(({theme:e,$selected:t,$size:n})=>o.css`
    background-color: transparent;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    ${t?o.css`
          background-color: ${e.colors.background};
          cursor: default;
          pointer-events: none;
          color: ${e.colors.accent};
        `:o.css`
          color: ${e.colors.text};
          &:hover {
            background-color: ${e.colors.foregroundSecondary};
          }
        `}

    border-radius: ${n==="small"?e.space[2]:e.radii.extraLarge};
    border: 1px solid ${e.colors.borderSecondary};
    min-width: ${n==="small"?e.space[9]:e.space[10]};
    padding: ${e.space[2]};
    height: ${n==="small"?e.space[9]:e.space[10]};
    font-size: ${n==="small"?e.space["3.5"]:e.fontSizes.small};
    font-weight: ${e.fontWeights.medium};
  `),va=u.default.p(({theme:e})=>o.css`
    font-size: ${e.fontSizes.small};
    font-weight: ${e.fontWeights.bold};
    color: ${e.colors.textTertiary};
  `),fn=({total:e,current:t,max:n=5,size:a="medium",alwaysShowFirst:s,alwaysShowLast:i,showEllipsis:l=!0,onChange:c,...d})=>{const f=Math.floor(n/2),m=Math.max(Math.min(Math.max(t-f,1),e-n+1),1),b=Array.from({length:n},($,p)=>m+p).filter($=>$<=e);return e>n&&(s&&m>1?l?(b[0]=-1,b.unshift(1)):b[0]=1:l&&m>1&&b.unshift(-1),i&&e>t+f?l?(b[b.length-1]=-1,b.push(e)):b[b.length-1]=e:l&&e>t+f&&b.push(-1)),r.createElement(ha,{...d,"data-testid":ee(d,"pagebuttons")},b.map(($,p)=>$===-1?r.createElement(va,{"data-testid":"pagebutton-dots",key:`${$}-${p}`},"..."):r.createElement(Ca,{$selected:$===t,$size:a,"data-testid":"pagebutton",key:$,type:"button",onClick:()=>c($)},$)))},Dt=u.default.div(({theme:e,$size:t,$hasChevron:n,$open:a})=>o.css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: ${e.radii.full};
    transition-duration: ${e.transitionDuration[150]};
    transition-property: color, border-color, background-color, transform,
      filter, box-shadow;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    position: relative;
    z-index: 10;
    padding: ${e.space[2]} ${e.space[4]} ${e.space[2]}
      ${e.space["2.5"]};
    box-shadow: ${e.shadows["0.25"]};
    color: ${e.colors.foregroundSecondary};
    background-color: ${e.colors.groupBackground};

    ${n&&o.css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `}

    ${a&&o.css`
      box-shadow: ${e.shadows[0]};
      background-color: ${e.colors.foregroundSecondary};
    `}

  ${()=>{switch(t){case"small":return o.css`
            max-width: ${e.space[48]};
          `;case"medium":return o.css`
            max-width: ${e.space[52]};
          `;case"large":return o.css`
            max-width: ${e.space[80]};
          `;default:return""}}}

  ${()=>{if(t==="small"&&n)return o.css`
          max-width: ${e.space[52]};
        `;if(t==="medium"&&n)return o.css`
          max-width: ${e.space[56]};
        `;if(t==="large"&&n)return o.css`
          max-width: calc(${e.space[80]} + ${e.space[4]});
        `}}
  `),ya=u.default.div(({theme:e})=>o.css`
    width: ${e.space[12]};
  `),xa=u.default.svg(({theme:e,$open:t})=>o.css`
    margin-left: ${e.space[1]};
    width: ${e.space[3]};
    margin-right: ${e.space["0.5"]};
    transition-duration: ${e.transitionDuration[200]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    opacity: 0.3;
    transform: rotate(0deg);
    display: flex;
    color: ${e.colors.foreground};

    ${t&&o.css`
      opacity: 1;
      transform: rotate(180deg);
    `}
  `),ka=u.default.div(({theme:e,$size:t})=>o.css`
    display: ${t==="small"?"none":"block"};
    margin: 0 ${e.space["1.5"]};
    min-width: ${e.space.none};
  `),At=u.default(K)(()=>o.css`
    line-height: initial;
  `),Zt=({size:e,avatar:t,address:n,ensName:a})=>r.createElement(r.Fragment,null,r.createElement(ya,null,r.createElement(ze,{label:"profile-avatar",...typeof t=="string"?{src:t}:t||{}})),r.createElement(ka,{$size:e},r.createElement(At,{color:a?"text":"textTertiary",ellipsis:!0,forwardedAs:"h3",variant:a&&e==="large"?"extraLarge":"large",weight:"bold"},a||"No name set"),r.createElement(At,{color:a?"textTertiary":"text",forwardedAs:"h4",variant:"small",weight:"bold"},Wo(n,e==="large"?30:10,e==="large"?10:5,e==="large"?10:5)))),pt=({size:e="medium",avatar:t,dropdownItems:n,address:a,ensName:s,alignDropdown:i="left",...l})=>{const[c,d]=r.useState(!1);return n?r.createElement(We,{items:n,isOpen:c,setIsOpen:d,align:i},r.createElement(Dt,{...l,$hasChevron:!0,$open:c,$size:e,onClick:()=>d(!c)},r.createElement(Zt,{size:e,avatar:t,address:a,ensName:s}),r.createElement(xa,{$open:c,as:ke}))):r.createElement(Dt,{...l,"data-testid":ee(l,"profile"),$open:c,$size:e},r.createElement(Zt,{size:e,avatar:t,address:a,ensName:s}))};pt.displayName="Profile";const Ea=u.default.input(({theme:e})=>o.css`
    cursor: pointer;
    font: inherit;
    border-radius: 50%;
    display: grid;
    place-content: center;
    transition: transform 150ms ease-in-out, filter 150ms ease-in-out;

    &:hover {
      transform: translateY(-1px);
      filter: contrast(0.7);
    }

    &:active {
      transform: translateY(0px);
      filter: contrast(1);
    }

    width: ${e.space[6]};
    height: ${e.space[6]};
    margin: ${e.space[2]} 0;
    background-color: ${e.colors.backgroundHide};

    &::before {
      content: '';
      width: ${e.space["4.5"]};
      height: ${e.space["4.5"]};
      border-radius: 50%;
      transform: scale(0);
      transition: transform 90ms ease-in-out;
      background-image: ${e.colors.gradients.blue};
      background-size: 100% 100%;
      background-position: center;
    }

    &:checked::before {
      transform: scale(1);
    }
  `),bt=r.forwardRef(({description:e,disabled:t,error:n,inline:a=!0,hideLabel:s,id:i,label:l,labelSecondary:c,name:d,required:f,tabIndex:m,value:b,checked:$,width:p,onBlur:E,onChange:C,onFocus:v,labelRight:S,...h},x)=>{const g=r.useRef(null),k=x||g;return r.createElement(Q,{description:e,error:n,hideLabel:s,id:i,inline:a,label:l,labelSecondary:c,required:f,width:p,labelRight:S},r.createElement(Ea,{...h,"aria-invalid":n?!0:void 0,"aria-selected":$?!0:void 0,"data-testid":ee(h,"radio"),type:"radio",role:"radio",checked:$,disabled:t,name:d,ref:k,tabIndex:m,value:b,onBlur:E,onChange:C,onFocus:v}))});bt.displayName="RadioButton";const Sa=e=>{let t=!1,n=!1;const a=()=>{t=!0,e.preventDefault()},s=()=>{n=!0,e.stopPropagation()};return{nativeEvent:e,currentTarget:e.currentTarget,target:e.target,bubbles:e.bubbles,cancelable:e.cancelable,defaultPrevented:e.defaultPrevented,eventPhase:e.eventPhase,isTrusted:e.isTrusted,preventDefault:a,isDefaultPrevented:()=>t,stopPropagation:s,isPropagationStopped:()=>n,persist:()=>{},timeStamp:e.timeStamp,type:e.type}},La=u.default.div(({theme:e,$inline:t})=>o.css`
    display: flex;
    flex-direction: ${t?"row":"column"};
    gap: ${e.space[2]};
    justify-content: flex-start;
    flex-wrap: ${t?"wrap":"nowrap"};
  `),$t=r.forwardRef(({value:e,children:t,inline:n=!1,onChange:a,onBlur:s,...i},l)=>{const c=r.useRef(null),d=l||c,f=r.useRef(null),[m,b]=r.useState(!1),[$,p]=r.useState(e);r.useEffect(()=>{e&&e!=$&&p(e)},[e]);const E=h=>{p(h.target.value),a&&a(h)},C=()=>{f.current&&f.current.focus()},v=h=>{s&&s(h)},S=(h,x="radiogroup")=>{if(a&&h){const g=document.createElement("input");g.value=h,g.name=x;const k=new Event("change",{bubbles:!0});Object.defineProperty(k,"target",{writable:!1,value:g});const y=Sa(k);a(y)}};return r.createElement(La,{$inline:n,...i,"data-testid":ee(i,"radiogroup"),ref:d,role:"radiogroup",onFocus:C},r.Children.map(t,h=>{h.props.checked&&!m&&(b(!0),$!==h.props.value&&(p(h.props.value),b(!0),S(h.props.value,h.props.name)));const x=h.props.value===$;return r.cloneElement(h,{ref:x?f:void 0,checked:x,onChange:E,onBlur:v})}))});$t.displayName="RadioButtonGroup";var Ra=typeof ae=="object"&&ae&&ae.Object===Object&&ae,Ta=Ra,Ma=Ta,Va=typeof self=="object"&&self&&self.Object===Object&&self,Ba=Ma||Va||Function("return this")(),Pa=Ba,Ga=Pa,za=Ga.Symbol,mt=za;function Ha(e,t){for(var n=-1,a=e==null?0:e.length,s=Array(a);++n<a;)s[n]=t(e[n],n,e);return s}var ja=Ha,Oa=Array.isArray,Fa=Oa,Wt=mt,pn=Object.prototype,Da=pn.hasOwnProperty,Aa=pn.toString,ve=Wt?Wt.toStringTag:void 0;function Za(e){var t=Da.call(e,ve),n=e[ve];try{e[ve]=void 0;var a=!0}catch{}var s=Aa.call(e);return a&&(t?e[ve]=n:delete e[ve]),s}var Wa=Za,Na=Object.prototype,Ia=Na.toString;function _a(e){return Ia.call(e)}var Ua=_a,Nt=mt,Ya=Wa,qa=Ua,Xa="[object Null]",Ka="[object Undefined]",It=Nt?Nt.toStringTag:void 0;function Ja(e){return e==null?e===void 0?Ka:Xa:It&&It in Object(e)?Ya(e):qa(e)}var Qa=Ja;function es(e){return e!=null&&typeof e=="object"}var ts=es,rs=Qa,ns=ts,os="[object Symbol]";function as(e){return typeof e=="symbol"||ns(e)&&rs(e)==os}var ss=as,_t=mt,is=ja,ls=Fa,cs=ss,ds=1/0,Ut=_t?_t.prototype:void 0,Yt=Ut?Ut.toString:void 0;function bn(e){if(typeof e=="string")return e;if(ls(e))return is(e,bn)+"";if(cs(e))return Yt?Yt.call(e):"";var t=e+"";return t=="0"&&1/e==-ds?"-0":t}var us=bn,gs=us;function fs(e){return e==null?"":gs(e)}var ps=fs,bs=ps,$s=0;function ms(e){var t=++$s;return bs(e)+t}var ws=ms;const Ke="CREATE_OPTION_VALUE",hs=u.default.div(({theme:e,$disabled:t,$size:n,$showBorder:a})=>o.css`
    background: ${e.colors.backgroundSecondary};
    ${a&&o.css`
      border: 1px solid ${e.colors.backgroundHide};
    `};
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    overflow: hidden;
    ${n==="small"?o.css`
          border-radius: ${e.space[2]};
          height: ${e.space[9]};
          font-size: ${e.space["3.5"]};
        `:n==="medium"?o.css`
          border-radius: ${e.radii.almostExtraLarge};
          height: ${e.space[10]};
        `:o.css`
          border-radius: ${e.radii["2xLarge"]};
          height: ${e.space[14]};
        `}

    ${t&&o.css`
      cursor: not-allowed;
      background: ${e.colors.backgroundTertiary};
    `}
  `),Cs=u.default.div(()=>o.css`
    flex: 1;
    overflow: hidden;
    display: flex;

    svg {
      display: block;
    }
  `),vs=u.default.div(()=>o.css`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  `),ys=u.default.div(()=>o.css`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1.4;
  `),xs=u.default.div(({theme:e,$padding:t,$gap:n})=>o.css`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    gap: ${e.space[n]};
    padding: ${e.space[t]};
    padding-right: 0;
    overflow: hidden;
  `),ks=u.default.div(({theme:e,$padding:t})=>o.css`
    padding: ${e.space[t]};
    padding-right: 0;
    color: ${e.colors.textPlaceholder};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `),Es=u.default.input(({theme:e,$padding:t})=>o.css`
    padding: ${e.space[t]};
    background: transparent;
    padding-right: 0;
    width: 100%;
    height: 100%;
  `),qt=u.default.button(({theme:e,$padding:t,$size:n})=>o.css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: ${e.space[t]};
    svg {
      display: block;
      width: ${n==="small"?e.space[2]:e.space[3]};
      path {
        color: ${e.colors.textSecondary};
      }
    }
  `),Ss=u.default(ke)(({theme:e,$open:t,$disabled:n,$direction:a})=>o.css`
    margin-left: ${e.space[1]};
    margin-right: ${e.space["0.5"]};
    transition-duration: ${e.transitionDuration[200]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    opacity: 0.3;
    transform: ${a==="up"?"rotate(180deg)":"rotate(0deg)"};
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${t&&o.css`
      opacity: 1;
      transform: ${a==="up"?"rotate(0deg)":"rotate(180deg)"};
    `}

    ${n&&o.css`
      opacity: 0.1;
    `}
  `),Ls=u.default.div(({theme:e,$state:t,$direction:n,$rows:a,$size:s,$align:i})=>o.css`
    display: ${t==="exited"?"none":"block"};
    position: absolute;
    visibility: hidden;
    opacity: 0;
    overflow: hidden;

    margin-top: ${e.space["1.5"]};
    padding: ${e.space["1.5"]};
    min-width: ${e.space.full};
    ${i==="right"?o.css`
          right: 0;
        `:o.css`
          left: 0;
        `}
    border-radius: ${e.radii.medium};
    box-shadow: ${e.boxShadows["0.02"]};
    background: ${e.colors.background};
    transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0.3s linear;

    ${s==="small"&&o.css`
      font-size: ${e.space["3.5"]};
    `}

    ${t==="entered"?o.css`
          z-index: 20;
          visibility: visible;
          top: ${n==="up"?"auto":`calc(100% + ${e.space["1.5"]})`};
          bottom: ${n==="up"?`calc(100% + ${e.space["1.5"]})`:"auto"};
          opacity: ${e.opacity[100]};
        `:o.css`
          z-index: 1;
          visibility: hidden;
          top: ${n==="up"?"auto":`calc(100% - ${e.space[12]})`};
          bottom: ${n==="up"?`calc(100% - ${e.space[12]})`:"auto"};
          opacity: 0;
        `}

    ${a&&o.css`
      padding-right: ${e.space[1]};
    `}
  `),Rs=u.default.div(({theme:e,$rows:t,$direction:n})=>o.css`
    display: flex;
    flex-direction: ${n==="up"?"column-reverse":"column"};
    align-items: flex-start;
    justify-content: space-between;
    overflow-y: ${t?"scroll":"hidden"};
    overflow-x: hidden;
    width: 100%;
    height: 100%;

    ${t&&o.css`
      max-height: calc(${e.space[9]} * ${t});
      border-color: rgba(${e.shadesRaw.foreground}, 0.05);
      transition: border-color 0.15s ease-in-out;
      padding-right: ${e.space[1]};

      /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      &::-webkit-scrollbar {
        width: ${e.space["1.5"]};
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border: none;
        border-radius: ${e.radii.full};
        border-right-style: inset;
        border-right-width: calc(100vw + 100vh);
        border-color: inherit;
      }

      &::-webkit-scrollbar-button {
        display: none;
      }

      &:hover {
        border-color: rgba(${e.shadesRaw.foreground}, 0.2);
      }
    `}
  `),Ts=u.default.div(({theme:e,$selected:t,$disabled:n,$highlighted:a,$gap:s})=>o.css`
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: ${e.space[s]};
    width: ${e.space.full};
    height: ${e.space[9]};
    padding: ${e.space["2.5"]} ${e.space[2]};
    justify-content: flex-start;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    border-radius: ${e.radii.medium};
    margin: ${e.space["0.5"]} 0;
    white-space: nowrap;

    &:first-child {
      margin-top: ${e.space[0]};
    }

    &:last-child {
      margin-bottom: ${e.space[0]};
    }

    ${()=>{if(t)return o.css`
          background-color: ${e.colors.foregroundSecondary};
        `;if(a)return o.css`
          background-color: ${e.colors.foregroundSecondaryHover};
        `}}

    ${n&&o.css`
      color: ${e.colors.textTertiary};
      cursor: not-allowed;

      &:hover {
        background-color: ${e.colors.transparent};
      }
    `}

    svg {
      display: block;
    }
  `),Ms=u.default.div(({theme:e})=>o.css`
    align-items: center;
    display: flex;
    gap: ${e.space[3]};
    width: ${e.space.full};
    height: ${e.space[9]};
    padding: 0 ${e.space[2]};
    justify-content: flex-start;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: all;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    border-radius: ${e.radii.medium};
    margin: ${e.space["0.5"]} 0;
    font-style: italic;
    white-space: nowrap;

    &:first-child {
      margin-top: ${e.space[0]};
    }

    &:last-child {
      margin-bottom: ${e.space[0]};
    }
  `),Vs=e=>(t,n)=>{if(n.label){const a=n.label.trim().toLowerCase();a.indexOf(e)!==-1&&t.options.push(n),a===e&&(t.exactMatch=!0)}return t};var $n=(e=>(e.ArrowUp="ArrowUp",e.ArrowDown="ArrowDown",e.Enter="Enter",e))($n||{});const Xt=(e,t,n)=>typeof n=="string"?n:(n==null?void 0:n[e])||t,Kt=(e,t,n)=>typeof n=="number"?n:(n==null?void 0:n[e])||t,wt=r.forwardRef(({description:e,disabled:t,autocomplete:n=!1,createable:a=!1,createablePrefix:s="Add ",placeholder:i,direction:l="down",error:c,hideLabel:d,inline:f,id:m,label:b,labelSecondary:$,required:p,tabIndex:E=-1,width:C,onBlur:v,onChange:S,onFocus:h,onCreate:x,options:g,rows:k,emptyListMessage:y="No results",name:T,value:R,size:L="medium",padding:z,inputSize:j,showBorder:O=!1,align:Z,...A},se)=>{const M=r.useRef(null),P=se||M,F=r.useRef(null),ie=r.useRef(null),[Ne,te]=r.useState(""),[W,$e]=r.useState(""),me=a&&W!=="",re=a||n,[ue]=r.useState(m||ws()),[le,ge]=r.useState("");r.useEffect(()=>{R!==le&&R!==void 0&&ge(R)},[R]);const ce=(g==null?void 0:g.find(w=>w.value===le))||null,Se=(w,B)=>{if(!(w!=null&&w.disabled)){if((w==null?void 0:w.value)===Ke)x&&x(W);else if(w!=null&&w.value&&(ge(w==null?void 0:w.value),B)){const q=B.nativeEvent||B,Re=new q.constructor(q.type,q);Object.defineProperties(Re,{target:{writable:!0,value:{value:w.value,name:T}},currentTarget:{writable:!0,value:{value:w.value,name:T}}}),S&&S(Re)}}},X=r.useMemo(()=>{if(!re||W==="")return g;const w=W.trim().toLowerCase(),{options:B,exactMatch:q}=(Array.isArray(g)?g:[g]).reduce(Vs(w),{options:[],exactMatch:!1});return[...B,...me&&!q?[{label:`${s}"${W}"`,value:Ke}]:[]]},[g,me,re,W,s]),[we,ne]=r.useState(-1),fe=r.useCallback(w=>{const B=X[w];if(B&&!B.disabled&&B.value!==Ke){ne(w),te(B.label||"");return}te(W),ne(w)},[X,W,te,ne]),D=w=>{var q;let B=we;do{if(w==="previous"?B--:B++,B<0)return fe(-1);if(X[B]&&!((q=X[B])!=null&&q.disabled))return fe(B)}while(X[B])},oe=w=>{const B=X[we];B&&Se(B,w),Et()},[Y,de]=r.useState(!1),Le=!t&&Y,Sn=W!==""&&re,Ln=Kt("min",4,j),Rn=Kt("max",20,j),Tn=Math.min(Math.max(Ln,W.length),Rn),[Ie,Mn]=rr.useTransition({timeout:{enter:0,exit:300},preEnter:!0});Be.useEffect(()=>{Mn(Le)},[Le]),Be.useEffect(()=>{!Y&&Ie==="unmounted"&&Et()},[Y,Ie]);const xt=L==="small"?"3":"4",he=Xt("outer",xt,z),kt=Xt("inner",xt,z),Et=()=>{$e(""),te(""),ne(-1)},Vn=()=>{re&&!Y&&de(!0),re||de(!Y)},St=w=>{if(!Y)return w.stopPropagation(),w.preventDefault(),de(!0);w.key in $n&&(w.preventDefault(),w.stopPropagation(),w.key==="ArrowUp"?D(l==="up"?"next":"previous"):w.key==="ArrowDown"&&D(l==="up"?"previous":"next"),w.key==="Enter"&&(oe(w),de(!1)))},Bn=w=>{const B=w.currentTarget.value;$e(B),te(B),ne(-1)},Pn=w=>{w.stopPropagation(),$e(""),te(""),ne(-1)},Gn=()=>{fe(-1)},zn=w=>B=>{B.stopPropagation(),Se(w,B),de(!1)},Hn=w=>{const B=Number(w.currentTarget.getAttribute("data-option-index"));isNaN(B)||fe(B)};ko(F,"click",()=>de(!1),Y);const Lt=({option:w})=>w?r.createElement(r.Fragment,null,w.prefix&&r.createElement("div",null,w.prefix),r.createElement(ys,null,w.node?w.node:w.label||w.value)):null;return r.createElement(Q,{"data-testid":"select",description:e,error:c,hideLabel:d,id:ue,inline:f,label:b,labelSecondary:$,required:p,width:C},r.createElement("div",{style:{position:"relative"}},r.createElement(hs,{...A,"aria-controls":`listbox-${ue}`,"aria-expanded":"true","aria-haspopup":"listbox","aria-invalid":c?!0:void 0,"data-testid":"select-container",role:"combobox",onClick:Vn,onKeyDown:St,$disabled:t,$showBorder:O,$size:L,id:`combo-${ue}`,ref:F,tabIndex:E,onBlur:v,onFocus:h},r.createElement(Cs,null,re&&Le?r.createElement(Es,{$padding:he,autoCapitalize:"none",autoComplete:"off",autoFocus:!0,"data-testid":"select-input",placeholder:ce==null?void 0:ce.label,ref:ie,size:Tn,spellCheck:"false",style:{flex:"1",height:"100%"},value:Ne,onChange:Bn,onKeyDown:w=>St(w)}):ce?r.createElement(xs,{$gap:kt,$padding:he,"data-testid":"selected"},r.createElement(Lt,{option:ce})):i?r.createElement(ks,{$padding:he},i):null),r.createElement(vs,null,Sn?r.createElement(qt,{$padding:he,$size:L,type:"button",onClick:Pn},r.createElement(lt,null)):r.createElement(qt,{$padding:he,$size:L,type:"button"},r.createElement(Ss,{$direction:l,$disabled:t,$open:Le,onClick:()=>de(!Y)}))),r.createElement(J,null,r.createElement("input",{"aria-hidden":!0,name:T,ref:P,tabIndex:-1,value:le,onChange:w=>{const B=w.target.value,q=g==null?void 0:g.find(Re=>Re.value===B);q&&(ge(q.value),S&&S(w))},onFocus:()=>{var w;ie.current?ie.current.focus():(w=F.current)==null||w.focus()}}))),r.createElement(Ls,{$align:Z,$direction:l,$rows:k,$size:L,$state:Ie,id:`listbox-${ue}`,role:"listbox",tabIndex:-1,onMouseLeave:Gn},r.createElement(Rs,{$direction:l,$rows:k},X.length===0&&r.createElement(Ms,null,y),X.map((w,B)=>r.createElement(Ts,{$selected:(w==null?void 0:w.value)===le,$disabled:w.disabled,$highlighted:B===we,$gap:kt,"data-option-index":B,"data-testid":`select-option-${w.value}`,key:w.value,role:"option",onClick:zn(w),onMouseOver:Hn},r.createElement(Lt,{option:w})))))))});wt.displayName="Select";const Bs=u.default.div(({theme:e})=>o.css`
    width: ${e.space.full};
  `),Jt=({theme:e})=>o.css`
  width: ${e.space[4]};
  height: ${e.space[4]};
  background: ${e.colors.accent};
  border-radius: ${e.radii.full};
  cursor: pointer;
  transition: filter 0.15s ease-in-out;
  filter: brightness(1);
  &:hover {
    filter: brightness(0.95);
  }
  &:active {
    filter: brightness(0.875);
  }
`,Ps=u.default.input(({theme:e,disabled:t})=>o.css`
    appearance: none;
    width: ${e.space.full};
    height: ${e.space["1.5"]};
    background: rgba(${e.accentsRaw.blue}, 0.4);
    border-radius: ${e.radii.full};
    outline: none;

    &::-webkit-slider-thumb {
      appearance: none;
      ${Jt}
    }

    &::-moz-range-thumb {
      ${Jt}
    }

    &:hover {
      background: rgba(${e.accentsRaw.blue}, 0.45);
    }

    ${t&&o.css`
      opacity: 0.5;
      filter: grayscale(100%);
      cursor: not-allowed;
    `}
  `),ht=r.forwardRef(({label:e,description:t,error:n,hideLabel:a,inline:s,labelPlacement:i,labelSecondary:l,required:c,width:d,defaultValue:f,disabled:m,id:b,name:$,readOnly:p,tabIndex:E,value:C,min:v=1,max:S=100,onChange:h,onBlur:x,onFocus:g,step:k="any",...y},T)=>{const R=r.useRef(null),L=T||R;return r.createElement(Q,{label:e,description:t,error:n,hideLabel:a,inline:s,labelPlacement:i,labelSecondary:l,required:c,width:d,id:b},z=>r.createElement(Bs,null,r.createElement(Ps,{ref:L,type:"range",...y,...z==null?void 0:z.content,defaultValue:f,disabled:m,name:$,readOnly:p,tabIndex:E,value:C,min:v,max:S,onChange:h,onBlur:x,onFocus:g,step:k})))});ht.displayName="Slider";const Gs=u.default.div(({theme:e,$error:t,$validated:n,$showDot:a,$disabled:s})=>o.css`
    position: relative;
    background-color: ${e.colors.backgroundSecondary};
    border-radius: ${e.radii["2xLarge"]};
    border-width: ${e.space["0.75"]};
    border-color: ${e.colors.transparent};
    color: ${e.colors.text};
    display: flex;
    transition-duration: ${e.transitionDuration[150]};
    transition-property: color, border-color, background-color;
    transition-timing-function: ${e.transitionTimingFunction.inOut};
    box-sizing: content-box;
    background-clip: content-box;

    :after {
      content: '';
      position: absolute;
      width: ${e.space[4]};
      height: ${e.space[4]};
      box-sizing: border-box;
      border-radius: 50%;
      right: 0;
      top: 0;
      transition: all 0.3s ease-out;
      ${()=>t&&a?o.css`
            background-color: ${e.colors.red};
            border: 2px solid ${e.colors.white};
            transform: translate(50%, -50%) scale(1);
          `:n&&a?o.css`
            background-color: ${e.colors.green};
            border: 2px solid ${e.colors.white};
            transform: translate(50%, -50%) scale(1);
          `:o.css`
          background-color: ${e.colors.transparent};
          border: 2px solid ${e.colors.transparent};
          transform: translate(50%, -50%) scale(0.2);
        `}
    }

    &:focus-within {
      ${!t&&o.css`
        border-color: ${e.colors.accentSecondary};
      `}
    }

    &:focus-within::after {
      ${!t&&a&&o.css`
        background-color: ${e.colors.blue};
        border-color: ${e.colors.white};
        transform: translate(50%, -50%) scale(1);
      `}
    }
    &:focus {
      border-color: ${e.colors.accentSecondary};
    }

    ${s&&o.css`
      border-color: ${e.colors.foregroundSecondary};
      cursor: not-allowed;
    `}

    ${t&&o.css`
      border-color: ${e.colors.red};
      cursor: default;

      &:focus-within {
        border-color: ${e.colors.red};
      }
    `}
  `),zs=u.default.textarea(({theme:e})=>o.css`
    position: relative;
    background-color: ${e.colors.transparent};
    color: ${e.colors.text};
    display: flex;
    font-family: ${e.fonts.sans};
    font-size: ${e.fontSizes.base};
    font-weight: ${e.fontWeights.medium};
    min-height: ${e.space[14]};
    padding: ${e.space[4]};
    width: ${e.space.full};
    resize: none;
    outline: none;

    &::placeholder {
      color: ${e.colors.textPlaceholder};
      font-weight: ${e.fontWeights.medium};
    }
  `),Ct=r.forwardRef(({autoCorrect:e,autoFocus:t,defaultValue:n,description:a,disabled:s,error:i,validated:l,showDot:c,hideLabel:d,id:f,label:m,labelSecondary:b,maxLength:$,name:p,placeholder:E,readOnly:C,required:v,rows:S=5,spellCheck:h,tabIndex:x,value:g,width:k,onChange:y,onBlur:T,onFocus:R,...L},z)=>{const j=r.useRef(null),O=z||j,Z=i?!0:void 0;return r.createElement(Q,{description:a,error:i,hideLabel:d,id:f,label:m,labelSecondary:b,required:v,width:k},A=>r.createElement(Gs,{$disabled:s,$error:!!i,$showDot:c,$validated:l},r.createElement(zs,{...L,...A==null?void 0:A.content,"aria-invalid":Z,$error:Z,$showDot:c,$validated:l,autoCorrect:e,autoFocus:t,defaultValue:n,disabled:s,maxLength:$,name:p,placeholder:E,readOnly:C,ref:O,rows:S,spellCheck:h,tabIndex:x,value:g,onBlur:T,onChange:y,onFocus:R})))});Ct.displayName="Textarea";const Qt={top:`
    &:after {
      display: initial;
      content: '';
      position: absolute;
      bottom: -18px;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-top-color: white;
    }
  `,bottom:`
    &:after {
      display: initial;
      content: '';
      position: absolute;
      top: -18px;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: white;
    }
  `,left:`
    display: flex;
    align-items: center;
    &:before {
      display: initial;
      content: '';
      position: absolute;
      right: -18px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-left-color: white;
    }
  `,right:`
    display: flex;
    align-items: center;
    &:before {
      display: initial;
      content: '';
      position: absolute;
      left: -18px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-right-color: white;
    }
  `},Hs=u.default.div(({theme:e,$placement:t,$mobilePlacement:n})=>o.css`
    box-sizing: border-box;
    position: relative;
    pointer-events: none;

    filter: drop-shadow(0px 0px 1px #e8e8e8)
      drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));

    border-radius: ${e.radii.large};
    padding: ${e.space["2.5"]} ${e.space["2.5"]} ${e.space["2.5"]}
      ${e.space["2.5"]};
    background: ${e.colors.background};

    ${Qt[n]}
    ${U.md.min(o.css`
      &:before {
        display: none;
      }
      &:after {
        display: none;
      }
      ${Qt[t]}
    `)}
  `),vt=({content:e,placement:t="top",mobilePlacement:n="top",...a})=>{const s=r.useRef(null);return Oe({popover:r.createElement(Hs,{"data-testid":"tooltip-popover",$mobilePlacement:n,$placement:t,ref:s},e),tooltipRef:s,placement:t,mobilePlacement:n,...a})};vt.displayName="Tooltip";const js=u.default.div(({theme:e})=>o.css`
    position: absolute;
    top: ${e.space[4]};
    right: ${e.space[4]};
    height: ${e.space[6]};
    width: ${e.space[6]};
    opacity: ${e.opacity[50]};
    cursor: pointer;
    transition-property: all;
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    &:hover {
      opacity: ${e.opacity[70]};
    }
  `),mn=u.default.div(({theme:e})=>o.css`
    padding: ${e.space["3.5"]};
    border-radius: ${e.radii["3xLarge"]};
    background-color: ${e.colors.background};
    position: relative;
    width: 100%;
    ${U.sm.min(o.css`
      width: initial;
    `)}
    ${U.md.min(o.css`
      max-width: 80vw;
    `)}
  `),Os=u.default(K)(({theme:e})=>o.css`
    font-size: ${e.fontSizes.headingThree};
    font-weight: ${e.fontWeights.bold};
  `),Fs=u.default(K)(({theme:e})=>o.css`
    font-size: ${e.fontSizes.base};
    font-weight: ${e.fontWeights.medium};
    color: ${e.colors.textSecondary};
    text-align: center;

    padding: 0 ${e.space[4]};
    max-width: ${e.space[72]};
  `),Ds=u.default.div(({theme:e,$center:t})=>o.css`
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: ${t?"column":"row"};
    gap: ${e.space[2]};
    width: ${e.space.full};
    max-width: ${e.space[96]};
  `),As=u.default.div(({theme:e,$hasSteps:t})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    ${!t&&o.css`
      margin-top: ${e.space["1.5"]};
    `}
  `),wn=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${e.space[5]};
    ${U.sm.min(o.css`
      min-width: ${e.space[64]};
    `)}
  `),Zs=u.default.div(({theme:e})=>o.css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${e.space[2]};
  `),Ws=u.default.div(({theme:e,$type:t})=>o.css`
    border-radius: ${e.radii.full};
    width: ${e.space["3.5"]};
    height: ${e.space["3.5"]};
    ${t==="notStarted"&&o.css`
      border: ${e.borderWidths["0.5"]} ${e.borderStyles.solid}
        ${e.colors.borderSecondary};
    `}
    ${t==="inProgress"&&o.css`
      border: ${e.borderWidths["0.5"]} ${e.borderStyles.solid}
        ${e.colors.accent};
    `}
    ${t==="completed"&&o.css`
      background-color: ${e.colors.accent};
    `}
  `),hn=({currentStep:e,stepCount:t,stepStatus:n,title:a,subtitle:s})=>{const i=r.useCallback(l=>l===e?n||"inProgress":l<(e||0)?"completed":"notStarted",[e,n]);return r.createElement(r.Fragment,null,t&&r.createElement(Zs,{"data-testid":"step-container"},Array.from({length:t},(l,c)=>r.createElement(Ws,{$type:i(c),"data-testid":`step-item-${c}-${i(c)}`,key:c}))),r.createElement(As,{$hasSteps:!!t},a&&(typeof a!="string"&&a||r.createElement(Os,null,a)),s&&(typeof s!="string"&&s||r.createElement(Fs,null,s))))},Cn=({leading:e,trailing:t,center:n})=>r.createElement(Ds,{$center:n},e||!n&&r.createElement("div",{style:{flexGrow:1}}),t||!n&&r.createElement("div",{style:{flexGrow:1}})),er=({open:e,onDismiss:t,title:n,subtitle:a,children:s,currentStep:i,stepCount:l,stepStatus:c,...d})=>r.createElement(Ee,{...d,open:e,onDismiss:t},r.createElement(mn,null,r.createElement(wn,null,r.createElement(hn,{title:n,subtitle:a,currentStep:i,stepCount:l,stepStatus:c}),s))),vn=({onClick:e})=>r.createElement(js,{as:st,"data-testid":"close-icon",onClick:e}),be=({children:e,onDismiss:t,open:n,variant:a="closable",...s})=>{if(a==="actionable"){const{trailing:i,leading:l,title:c,subtitle:d,center:f,...m}=s;return r.createElement(er,{...m,open:n,subtitle:d,title:c,onDismiss:t},e,(l||i)&&r.createElement(Cn,{leading:l,trailing:i,center:f}))}else if(a==="closable"){const{title:i,subtitle:l,...c}=s;return r.createElement(er,{...c,open:n,subtitle:l,title:i,onDismiss:t},e,t&&r.createElement(vn,{onClick:t}))}return r.createElement(Ee,{onDismiss:t,open:n},r.createElement(mn,null,r.createElement(wn,null,e)))};be.displayName="Dialog";be.Footer=Cn;be.Heading=hn;be.CloseButton=vn;const yn=u.default.div(({theme:e})=>o.css`
    position: absolute;
    top: ${e.space["2.5"]};
    right: ${e.space["2.5"]};
    height: ${e.space[8]};
    width: ${e.space[8]};
    opacity: ${e.opacity[50]};
    cursor: pointer;
    transition-property: all;
    transition-duration: ${e.transitionDuration[150]};
    transition-timing-function: ${e.transitionTimingFunction.inOut};

    &:hover {
      opacity: ${e.opacity[70]};
    }
  `),xn=u.default.div(({theme:e,$state:t,$top:n,$left:a,$right:s,$bottom:i,$mobile:l,$popped:c})=>o.css`
    position: fixed;
    z-index: 10000;

    width: 92.5%;
    left: 3.75%;
    top: calc(100vh / 100 * 2.5);

    ${c&&o.css`
      width: 95%;
      left: 2.5%;
      touch-action: none;
    `}

    ${!l&&o.css`
      max-width: ${e.space[112]};
      top: unset;
      left: unset;

      ${n&&`top: ${e.space[n]};`}
      ${a&&`left: ${e.space[a]};`}
      ${s&&`right: ${e.space[s]};`}
      ${i&&`bottom: ${e.space[i]};`}
    `}

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: ${e.space["4.5"]};

    background: rgba(${e.shadesRaw.background}, 0.8);
    box-shadow: ${e.boxShadows["0.02"]};
    border: ${e.borderWidths.px} solid ${e.colors.foregroundSecondary};
    backdrop-filter: blur(16px);
    border-radius: ${e.radii["2xLarge"]};

    transition: ${e.transitionDuration[300]} all
      ${e.transitionTimingFunction.popIn};

    ${t==="entered"?o.css`
          opacity: 1;
          transform: translateY(0px);
        `:o.css`
          opacity: 0;
          transform: translateY(-64px);
        `}
  `),kn=u.default(K)(({theme:e})=>o.css`
    line-height: ${e.lineHeights.normal};
  `),Ns=u.default.div(({theme:e})=>o.css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${e.space[3]};
    margin-bottom: calc(-1 * ${e.space[2]});
  `),Is=u.default.div(({theme:e})=>o.css`
    width: ${e.space[8]};
    height: ${e.space[1]};
    border-radius: ${e.radii.full};
    background: ${e.colors.border};
  `),_s=()=>r.createElement(Ns,null,r.createElement(Is,null)),Us=({onClose:e,title:t,description:n,top:a="4",left:s,right:i="4",bottom:l,state:c,children:d,...f})=>r.createElement(xn,{...f,"data-testid":ee(f,"toast-desktop"),$bottom:l,$left:s,$mobile:!1,$right:i,$state:c,$top:a},r.createElement(yn,{as:Ze,"data-testid":"close-icon",onClick:()=>e()}),r.createElement(kn,{variant:"large",weight:"bold"},t),r.createElement(K,null,n),d&&r.createElement(En,null,d)),En=u.default.div(({theme:e})=>o.css`
    margin-top: ${e.space[3]};
    width: 100%;
  `),Ys=({onClose:e,open:t,title:n,description:a,left:s,right:i="4",bottom:l,state:c,children:d,popped:f,setPopped:m,...b})=>{const{space:$}=o.useTheme(),p=r.useRef(null),[E,C]=r.useState(.025*window.innerHeight),[v,S]=r.useState([]);r.useEffect(()=>{t&&C(.025*window.innerHeight)},[t]),r.useEffect(()=>{var k;const g=.025*window.innerHeight;if(v.length&&!f){let y=!1,T=v[v.length-1];T===void 0&&(T=v[v.length-2]||0,y=!0);const R=parseInt(getComputedStyle(document.documentElement).fontSize),L=v[0]-T;if(y)parseFloat($[8])*R>(((k=p.current)==null?void 0:k.offsetHeight)||0)-L?e():(C(g),S([]));else if(L*-1>parseFloat($[32])*R)C(g*2),m(!0);else if(L>0)C(g-L);else{const z=.25*(L^2);C(g-z)}}},[v]);const h=r.useCallback(g=>{var k;g.preventDefault(),S([(k=g.targetTouches.item(0))==null?void 0:k.pageY])},[]),x=r.useCallback(g=>{g.preventDefault(),S(k=>{var y;return[...k,(y=g.targetTouches.item(0))==null?void 0:y.pageY]})},[]);return r.useEffect(()=>{const g=p.current;return g==null||g.addEventListener("touchstart",h,{passive:!1,capture:!1}),g==null||g.addEventListener("touchmove",x,{passive:!1,capture:!1}),()=>{g==null||g.removeEventListener("touchstart",h,{capture:!1}),g==null||g.removeEventListener("touchmove",x,{capture:!1})}},[]),r.useEffect(()=>{const g=p.current;f&&(g==null||g.removeEventListener("touchstart",h,{capture:!1}),g==null||g.removeEventListener("touchmove",x,{capture:!1}))},[f]),r.createElement(xn,{...b,"data-testid":ee(b,"toast-touch"),style:{top:`${E}px`},onClick:()=>m(!0),onTouchEnd:()=>S(g=>[...g,void 0]),$bottom:l,$left:s,$mobile:!0,$popped:f,$right:i,$state:c,ref:p},r.createElement(kn,{variant:"large",weight:"bold"},n),r.createElement(K,null,a),f&&r.createElement(r.Fragment,null,d&&r.createElement(En,null,d),r.createElement(yn,{as:Ze,"data-testid":"close-icon",onClick:g=>{g.stopPropagation(),e()}})),!f&&r.createElement(_s,null))},yt=({onClose:e,open:t,msToShow:n=8e3,variant:a="desktop",...s})=>{const[i,l]=r.useState(!1),c=r.useRef();return r.useEffect(()=>{if(t)return l(!1),c.current=setTimeout(()=>e(),n||8e3),()=>{clearTimeout(c.current),e()}},[t]),r.useEffect(()=>{i&&clearTimeout(c.current)},[i]),r.createElement(xe,{className:"toast",noBackground:!0,open:t,onDismiss:a==="touch"&&i?()=>e():void 0},({state:d})=>a==="touch"?r.createElement(Ys,{...s,open:t,popped:i,setPopped:l,state:d,onClose:e}):r.createElement(Us,{...s,open:t,state:d,onClose:e}))};yt.displayName="Toast";var qs=Object.freeze(Object.defineProperty({__proto__:null,Avatar:ze,BackdropSurface:Qe,Button:je,Card:et,DynamicPopover:Oe,Field:Q,FileInput:tt,Heading:Fe,Portal:De,ScrollBox:wr,Skeleton:nt,Spinner:ye,Tag:Ae,Typography:K,VisuallyHidden:J,Backdrop:xe,Checkbox:ot,CountdownCircle:dt,Dropdown:We,FieldSet:ut,Helper:gt,Input:ft,Modal:Ee,PageButtons:fn,Profile:pt,RadioButton:bt,RadioButtonGroup:$t,Select:wt,SkeletonGroup:rt,Slider:ht,Textarea:Ct,Tooltip:vt,Dialog:be,Toast:yt,AlertSVG:at,ArrowCircleSVG:vr,ArrowRightSVG:yr,ArrowUpSVG:xr,BookOpenSVG:kr,CancelCircleSVG:st,CheckSVG:it,ChevronDownSVG:Er,ChevronLeftSVG:Sr,ChevronRightSVG:Lr,ChevronUpSVG:Rr,CloseSVG:lt,CodeSVG:Tr,CogSVG:Mr,CollectionSVG:Vr,CopySVG:Br,DocumentsSVG:Pr,DotsVerticalSVG:Gr,DownIndicatorSVG:ke,DuplicateSVG:zr,EthSVG:Hr,EthTransparentSVG:jr,EthTransparentInvertedSVG:Or,ExclamationSVG:Fr,ExitSVG:Ze,FlagSVG:Dr,FlameSVG:Ar,FlameBurnedSVG:Zr,GradientSVG:Wr,GridSVG:Nr,GridSolidSVG:Ir,HandSVG:_r,InfoSVG:ct,LinkSVG:Ur,ListSVG:Yr,LockClosedSVG:qr,LogoSVG:Xr,MenuSVG:Kr,MoonSVG:Jr,PencilSVG:Qr,PlusSVG:en,PlusSmallSVG:tn,RefreshSVG:rn,SearchSVG:nn,SplitSVG:on,SunSVG:an,TokensSVG:sn,TrendingUpSVG:ln,UploadSVG:cn,UserSolidSVG:dn,UsersSolidSVG:un,WalletSVG:gn},Symbol.toStringTag,{value:"Module"}));const Xs=o.createGlobalStyle(({theme:e})=>o.css`
    *,
    ::before,
    ::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: ${e.fonts.sans};
      border-color: ${e.colors.foregroundSecondary};
      border-style: ${e.borderStyles.solid};
      border-width: 0;
      color: ${e.colors.current};
      font-size: 100%;
      font-feature-settings: 'ss01' on, 'ss03' on;
      vertical-align: baseline;
    }

    [data-js-focus-visible] &:focus:not([data-focus-visible-added]) {
      outline: none;
    }

    html {
      font-size: ${e.fontSizes.root};
      color: ${e.colors.foreground};
      text-rendering: optimizeLegibility;
      background: radial-gradient(
          40.48% 67.6% at 50% 32.4%,
          #ecf4ff 0%,
          #f7f7ff 52.77%,
          #f7f7f7 100%
        ),
        #ffffff;
    }

    body {
      line-height: ${e.lineHeights.none};
    }

    article,
    aside,
    details,
    div,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section {
      display: block;
    }

    ul,
    ol {
      list-style: none;
    }

    blockquote {
      quotes: none;

      &::before,
      &::after {
        content: '';
      }
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    fieldset {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${e.colors.textTertiary};
        opacity: ${e.opacity[100]};
      }
    }

    mark {
      background-color: ${e.colors.transparent};
      color: ${e.colors.inherit};
    }

    select {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${e.colors.textTertiary};
        opacity: ${e.opacity[100]};
      }

      &:-ms-expand {
        display: none;
      }
    }

    input {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${e.colors.textTertiary};
        opacity: ${e.opacity[100]};
      }
      &::-webkit-outer-spin-button {
        webkit-appearance: none;
      }
      &::-webkit-inner-spin-button {
        webkit-appearance: none;
      }
      &::-ms-clear {
        display: none;
      }
      &::-webkit-search-cancel-button {
        webkit-appearance: none;
      }
    }

    button {
      background: none;
    }

    a {
      text-decoration: none;
      color: ${e.colors.inherit};
    }
  `);exports.AlertSVG=at;exports.ArrowCircleSVG=vr;exports.ArrowRightSVG=yr;exports.ArrowUpSVG=xr;exports.Avatar=ze;exports.Backdrop=xe;exports.BackdropSurface=Qe;exports.BookOpenSVG=kr;exports.Button=je;exports.CancelCircleSVG=st;exports.Card=et;exports.CheckSVG=it;exports.Checkbox=ot;exports.ChevronDownSVG=Er;exports.ChevronLeftSVG=Sr;exports.ChevronRightSVG=Lr;exports.ChevronUpSVG=Rr;exports.CloseSVG=lt;exports.CodeSVG=Tr;exports.CogSVG=Mr;exports.CollectionSVG=Vr;exports.Components=qs;exports.CopySVG=Br;exports.CountdownCircle=dt;exports.Dialog=be;exports.DocumentsSVG=Pr;exports.DotsVerticalSVG=Gr;exports.DownIndicatorSVG=ke;exports.Dropdown=We;exports.DuplicateSVG=zr;exports.DynamicPopover=Oe;exports.EthSVG=Hr;exports.EthTransparentInvertedSVG=Or;exports.EthTransparentSVG=jr;exports.ExclamationSVG=Fr;exports.ExitSVG=Ze;exports.Field=Q;exports.FieldSet=ut;exports.FileInput=tt;exports.FlagSVG=Dr;exports.FlameBurnedSVG=Zr;exports.FlameSVG=Ar;exports.GradientSVG=Wr;exports.GridSVG=Nr;exports.GridSolidSVG=Ir;exports.HandSVG=_r;exports.Heading=Fe;exports.Helper=gt;exports.InfoSVG=ct;exports.Input=ft;exports.LinkSVG=Ur;exports.ListSVG=Yr;exports.LockClosedSVG=qr;exports.LogoSVG=Xr;exports.MenuSVG=Kr;exports.Modal=Ee;exports.MoonSVG=Jr;exports.PageButtons=fn;exports.PencilSVG=Qr;exports.PlusSVG=en;exports.PlusSmallSVG=tn;exports.Portal=De;exports.Profile=pt;exports.RadioButton=bt;exports.RadioButtonGroup=$t;exports.RefreshSVG=rn;exports.ScrollBox=wr;exports.SearchSVG=nn;exports.Select=wt;exports.Skeleton=nt;exports.SkeletonGroup=rt;exports.Slider=ht;exports.Spinner=ye;exports.SplitSVG=on;exports.SunSVG=an;exports.Tag=Ae;exports.Textarea=Ct;exports.ThorinGlobalStyles=Xs;exports.Toast=yt;exports.TokensSVG=sn;exports.Tooltip=vt;exports.TrendingUpSVG=ln;exports.Typography=K;exports.UploadSVG=cn;exports.UserSolidSVG=dn;exports.UsersSolidSVG=un;exports.VisuallyHidden=J;exports.WalletSVG=gn;exports.baseTheme=Pe;exports.darkTheme=Nn;exports.lightTheme=Wn;exports.mq=U;exports.tokens=_;
