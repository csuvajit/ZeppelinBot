(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{287:function(t,l,s){"use strict";s.r(l);var i=s(16),a={async mounted(){await this.$store.dispatch("guilds/loadAvailableGuilds"),this.loading=!1},data:()=>({loading:!0}),computed:{...Object(i.b)("guilds",{guilds:t=>{const l=Array.from(t.available.values());return l.sort((t,l)=>t.name>l.name?1:t.name<l.name?-1:t.id>l.id?1:t.id<l.id?-1:0),l}})}},n=s(8),e=Object(n.a)(a,(function(){var t=this,l=t.$createElement,s=t._self._c||l;return t.loading?s("div",[t._v("\n\t\tLoading...\n\t")]):s("div",[s("h1",[t._v("Guilds")]),t._v(" "),s("ul",{staticClass:"list-none flex flex-wrap -m-4 pt-4"},t._l(t.guilds,(function(l){return s("li",{staticClass:"flex-none p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"},[s("div",{staticClass:"flex items-center"},[s("div",{staticClass:"flex-none w-12 h-12"},[l.icon?s("img",{staticClass:"rounded-full w-full h-full",attrs:{src:l.icon,alt:"",title:"Logo for guild "+l.name}}):s("div",{staticClass:"bg-gray-700 rounded-full w-full h-full"})]),t._v(" "),s("div",{staticClass:"flex-auto ml-4"},[s("div",[s("div",{staticClass:"font-semibold leading-tight"},[t._v(t._s(l.name))]),t._v(" "),s("div",{staticClass:"text-gray-600 text-sm leading-tight"},[t._v(t._s(l.id))])]),t._v(" "),s("div",{staticClass:"pt-1"},[s("span",{staticClass:"inline-block bg-gray-700 rounded px-1 opacity-50 select-none"},[t._v("Info")]),t._v(" "),s("router-link",{staticClass:"inline-block bg-gray-700 rounded px-1 hover:bg-gray-800",attrs:{to:"/dashboard/guilds/"+l.id+"/config"}},[t._v("Config")]),t._v(" "),s("span",{staticClass:"inline-block bg-gray-700 rounded px-1 opacity-50 select-none"},[t._v("Access")])],1)])])])})),0)])}),[],!1,null,null,null);l.default=e.exports}}]);
//# sourceMappingURL=18.6c3f32137192f26bcd0f.js.map