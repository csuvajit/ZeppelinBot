(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{10:function(n,e,t){var o=t(13);"string"==typeof o&&(o=[[n.i,o,""]]),o.locals&&(n.exports=o.locals);(0,t(1).default)("8a2f0592",o,!0,{})},11:function(n,e,t){"use strict";var o={props:["codeLang","trim"]},a=t(8),i=Object(a.a)(o,(function(){var n=this.$createElement,e=this._self._c||n;return e("pre",{directives:[{name:"highlightjs",rawName:"v-highlightjs"}],staticClass:"codeblock"},[e("code",{directives:[{name:"trim-indents",rawName:"v-trim-indents",value:this.trim,expression:"trim"}],class:this.codeLang},[this._t("default")],2)])}),[],!1,null,null,null);e.a=i.exports},12:function(n,e,t){"use strict";var o=t(10);t.n(o).a},13:function(n,e,t){(n.exports=t(0)(!1)).push([n.i,".link[data-v-42da7eb4]{--text-opacity:1;color:#63b3ed;color:rgba(99,179,237,var(--text-opacity));text-decoration:underline}.link[data-v-42da7eb4]:hover{--text-opacity:1;color:#bee3f8;color:rgba(190,227,248,var(--text-opacity))}.inline-code[data-v-42da7eb4]{display:inline-block;padding-left:.25rem;padding-right:.25rem}.codeblock[data-v-42da7eb4],.inline-code[data-v-42da7eb4]{--bg-opacity:1;background-color:#2d3748;background-color:rgba(45,55,72,var(--bg-opacity));border-radius:.25rem;font-size:.875rem}.codeblock[data-v-42da7eb4]{padding:.75rem;margin-bottom:1rem;box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)}.codeblock .hljs[data-v-42da7eb4]{background-color:initial;padding:0}.inline-icon[data-v-42da7eb4]{top:.125rem}.sr-only-when-not-focused[data-v-42da7eb4]:not(:focus-within){position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.expandable[data-v-42da7eb4]{--animation-time:400ms;--target-height:auto;transition:box-shadow var(--animation-time)}.expandable>.title:hover .title-text[data-v-42da7eb4]{text-decoration:underline}.expandable>.title .icon[data-v-42da7eb4]{transition:transform var(--animation-time);transform-origin:50% 50%;position:relative;top:.125rem}.expandable>.title .icon-open[data-v-42da7eb4]{transform:rotate(179deg)}.expandable>.content[data-v-42da7eb4]{overflow:hidden;display:none}@keyframes open-data-v-42da7eb4{0%{height:0}to{height:var(--target-height)}}@keyframes close-data-v-42da7eb4{to{height:0}0%{height:var(--target-height)}}.opening[data-v-42da7eb4]{animation:open-data-v-42da7eb4 var(--animation-time) ease-in-out}.closing[data-v-42da7eb4]{animation:close-data-v-42da7eb4 var(--animation-time) ease-in-out}.inline-code[data-v-42da7eb4],[data-v-42da7eb4] code:not([class]),code[data-v-42da7eb4]:not([class]){--bg-opacity:1;background-color:#1a202c;background-color:rgba(26,32,44,var(--bg-opacity))}.codeblock[data-v-42da7eb4]{box-shadow:none}",""])},14:function(n,e,t){"use strict";var o=t(15);var a={components:{ChevronDown:o.a},mounted(){this.$refs.root.style.setProperty("--animation-time","400ms")},data:()=>({isOpen:!1,animating:!1}),methods:{toggle(){this.isOpen?this.close():this.open()},open(){if(this.animating)return;this.animating=!0,this.isOpen=!0,this.$refs.content.style.display="block";const n=this.$refs.content.clientHeight;this.$refs.content.style.setProperty("--target-height",`${n}px`),this.$refs.content.classList.add("opening"),setTimeout(()=>{this.$refs.content.classList.remove("opening"),this.animating=!1},400)},close(){if(this.animating)return;this.animating=!0,this.isOpen=!1;const n=this.$refs.content.clientHeight;this.$refs.content.style.setProperty("--target-height",`${n}px`),this.$refs.content.classList.add("closing"),setTimeout(()=>{this.$refs.content.classList.remove("closing"),this.$refs.content.style.display="none",this.animating=!1},400)}}},i=(t(12),t(8)),r=Object(i.a)(a,(function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{ref:"root",staticClass:"expandable mb-4 bg-gray-800 border border-gray-600 rounded overflow-hidden",class:{"shadow-xl":n.isOpen}},[t("div",{staticClass:"title p-2 focus:bg-gray-700",attrs:{role:"button",tabindex:"0"},on:{click:n.toggle,keydown:function(e){return!e.type.indexOf("key")&&n._k(e.keyCode,"space",32,e.key,[" ","Spacebar"])?null:e.preventDefault()},keyup:function(e){return!e.type.indexOf("key")&&n._k(e.keyCode,"space",32,e.key,[" ","Spacebar"])?null:n.toggle(e)}}},[t("chevron-down",{staticClass:"icon",class:{"icon-open":n.isOpen},attrs:{decorative:""}}),n._v(" "),t("span",{staticClass:"title-text"},[n._t("title")],2)],1),n._v(" "),t("div",{ref:"content",staticClass:"content border-t border-gray-700"},[t("div",{staticClass:"p-4 pb-0"},[n._t("content")],2)])])}),[],!1,null,"42da7eb4",null);e.a=r.exports},15:function(n,e,t){"use strict";var o={name:"ChevronDownIcon",props:{title:{type:String,default:"Chevron Down icon"},decorative:{type:Boolean,default:!1},fillColor:{type:String,default:"currentColor"},size:{type:Number,default:24}}},a=t(8),i=Object(a.a)(o,(function(n,e){var t=e._c;return t("span",e._g({staticClass:"material-design-icon chevron-down-icon",class:[e.data.class,e.data.staticClass],attrs:{"aria-hidden":e.props.decorative,"aria-label":e.props.title,role:"img"}},e.listeners),[t("svg",{staticClass:"material-design-icon__svg",attrs:{fill:e.props.fillColor,width:e.props.size,height:e.props.size,viewBox:"0 0 24 24"}},[t("path",{attrs:{d:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"}},[t("title",[e._v(e._s(e.props.title))])])])])}),[],!0,null,null,null);e.a=i.exports},285:function(n,e,t){"use strict";t.r(e);var o=t(11),a=t(14),i={components:{CodeBlock:o.a,Expandable:a.a}},r=t(8),s=Object(r.a)(i,(function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",[t("h1",[n._v("Counters")]),n._v(" "),t("p",[n._v("\n    Counters are an advanced feature in Zeppelin that allows you keep track of per-user, per-channel, or global numbers and trigger specific actions based on this number.\n    Common use cases are infraction points, XP systems, activity roles, and so on.\n  ")]),n._v(" "),t("p",[n._v("\n    This guide will be expanded in the future. For now, it contains examples of common counter use cases.\n    Also see the "),t("router-link",{attrs:{to:"/docs/plugins/counters"}},[n._v("documentation for the Counters plugin.")])],1),n._v(" "),t("h2",[n._v("Examples")]),n._v(" "),t("h3",[n._v("Infraction points")]),n._v(" "),t("p",[n._v('\n    In this example, warns, mutes, and kicks all accumulate "infraction points" for a user.\n    When the user reaches too many points, they are automatically banned.\n  ')]),n._v(" "),t("Expandable",{staticClass:"wide",scopedSlots:n._u([{key:"title",fn:function(){return[n._v("Click to view example")]},proxy:!0},{key:"content",fn:function(){return[t("CodeBlock",{attrs:{"code-lang":"yaml"}},[n._v('\n        plugins:\n\n          counters:\n            config:\n              counters:\n\n                infraction_points:\n                  per_user: true\n                  triggers:\n                    # When a user accumulates 50 or more (>=50) infraction points, this trigger will activate.\n                    # The numbers here are arbitrary - you could choose to use 5 or 500 instead, depending on the granularity you want.\n                    autoban:\n                      condition: ">=50"\n                  # Remove 1 infraction point each day\n                  decay:\n                    amount: 1\n                    every: 24h\n\n          automod:\n            config:\n              rules:\n\n                add_infraction_points_on_warn:\n                  triggers:\n                    - warn: {}\n                  actions:\n                    add_to_counter:\n                      counter: "infraction_points"\n                      amount: 10\n\n                add_infraction_points_on_mute:\n                  triggers:\n                    - mute: {}\n                  actions:\n                    add_to_counter:\n                      counter: "infraction_points"\n                      amount: 20\n\n                add_infraction_points_on_kick:\n                  triggers:\n                    - kick: {}\n                  actions:\n                    add_to_counter:\n                      counter: "infraction_points"\n                      amount: 40\n\n                autoban_on_too_many_infraction_points:\n                  triggers:\n                    # The counter trigger we specified further above, "autoban", is used to trigger an automod rule here\n                    - counter_trigger:\n                        counter: "infraction_points"\n                        trigger: "autoban"\n                  actions:\n                    ban:\n                      reason: "Too many infraction points"\n      ')])]},proxy:!0}])}),n._v(" "),t("h3",[n._v("Escalating automod punishments")]),n._v(" "),t("p",[n._v("\n    This example allows users to trigger the `some_infraction` automod rule 3 times. On the 4th time, they are automatically muted.\n  ")]),n._v(" "),t("Expandable",{staticClass:"wide",scopedSlots:n._u([{key:"title",fn:function(){return[n._v("Click to view example")]},proxy:!0},{key:"content",fn:function(){return[t("CodeBlock",{attrs:{"code-lang":"yaml"}},[n._v('\n        plugins:\n\n          counters:\n            config:\n              counters:\n\n                automod_infractions:\n                  per_user: true\n                  triggers:\n                    # When a user accumulates 100 or more (>=100) automod infraction points, this trigger will activate\n                    # The numbers here are arbitrary - you could choose to use 10 or 1000 instead.\n                    too_many_infractions:\n                      condition: ">=100"\n                  # Remove 100 automod infraction points per hour\n                  decay:\n                    amount: 100\n                    every: 1h\n\n          automod:\n            config:\n              rules:\n\n                # An example automod rule that adds automod infraction points\n                some_infraction:\n                  triggers:\n                    - match_words:\n                        words: [\'poopoo head\']\n\n                  actions:\n                    clean: true\n                    reply: \'Do not insult other users\'\n                    add_to_counter:\n                      counter: "automod_infractions"\n                      amount: 25 # This infraction adds 25 automod infraction points\n\n                # An example rule that is triggered when the user accumulates too many automod infraction points\n                automute_on_too_many_infractions:\n                  triggers:\n                    - counter_trigger:\n                        counter: "automod_infractions"\n                        trigger: "too_many_infractions"\n\n                  actions:\n                    mute:\n                      reason: "You have been muted for tripping too many automod filters"\n                      remove_roles_on_mute: true\n                      restore_roles_on_mute: true\n      ')])]},proxy:!0}])}),n._v(" "),t("h3",[n._v("Simple XP system")]),n._v(" "),t("p",[n._v("\n    This example creates an XP system where every message sent grants you 1 XP, max once per minute.\n    At 100, 250, 500, and 1000 XP the system grants the user a new role.\n  ")]),n._v(" "),t("Expandable",{staticClass:"wide",scopedSlots:n._u([{key:"title",fn:function(){return[n._v("Click to view example")]},proxy:!0},{key:"content",fn:function(){return[t("CodeBlock",{attrs:{"code-lang":"yaml"}},[n._v('\n        plugins:\n\n          counters:\n            config:\n              counters:\n                xp:\n                  per_user: true\n                  triggers:\n                    role_1:\n                      condition: ">=100"\n                    role_2:\n                      condition: ">=250"\n                    role_3:\n                      condition: ">=500"\n                    role_4:\n                      condition: ">=1000"\n\n          automod:\n            config:\n              rules:\n\n                accumulate_xp:\n                  triggers:\n                    - any_message: {}\n\n                  actions:\n                    log: false # Don\'t spam logs with XP changes\n                    add_to_counter:\n                      counter: "xp"\n                      amount: 1 # Each message adds 1 XP\n\n                  cooldown: 1m # Only count 1 message per minute\n\n                add_xp_role_1:\n                  triggers:\n                    - counter_trigger:\n                        counter: "xp"\n                        trigger: "role_1"\n\n                  actions:\n                    add_roles: ["123456789123456789"] # Role ID for xp role 1\n\n                add_xp_role_2:\n                  triggers:\n                    - counter_trigger:\n                        counter: "xp"\n                        trigger: "role_2"\n\n                  actions:\n                    add_roles: ["123456789123456789"] # Role ID for xp role 2\n\n                add_xp_role_3:\n                  triggers:\n                    - counter_trigger:\n                        counter: "xp"\n                        trigger: "role_3"\n\n                  actions:\n                    add_roles: ["123456789123456789"] # Role ID for xp role 3\n\n                add_xp_role_4:\n                  triggers:\n                    - counter_trigger:\n                        counter: "xp"\n                        trigger: "role_4"\n\n                  actions:\n                    add_roles: ["123456789123456789"] # Role ID for xp role 4\n      ')])]},proxy:!0}])}),n._v(" "),t("h3",[n._v('Activity role ("regular role")')]),n._v(" "),t("p",[n._v("\n    This example is similar to the XP system, but the number decays and the role granted by the system can be removed if the user's activity goes down.\n  ")]),n._v(" "),t("Expandable",{staticClass:"wide",scopedSlots:n._u([{key:"title",fn:function(){return[n._v("Click to view example")]},proxy:!0},{key:"content",fn:function(){return[t("CodeBlock",{attrs:{"code-lang":"yaml"}},[n._v('\n        plugins:\n\n          counters:\n            config:\n              counters:\n                activity:\n                  per_user: true\n                  triggers:\n                    grant_role:\n                      condition: ">=100"\n                      # We set a separate threshold for when the role should be removed. This is so the decay doesn\'t remove the activity role immediately.\n                      # If this value isn\'t set, reverse_condition defaults to the opposite of the condition, i.e. "<100" in this case.\n                      reverse_condition: "<50"\n                  decay:\n                    amount: 1\n                    every: 1h\n\n          automod:\n            config:\n              rules:\n\n                accumulate_activity:\n                  triggers:\n                    - any_message: {}\n\n                  actions:\n                    log: false # Don\'t spam logs with activity changes\n                    add_to_counter:\n                      counter: "activity"\n                      amount: 1 # Each message adds 1 to the counter\n\n                  cooldown: 1m # Only count 1 message per minute\n\n                grant_activity_role:\n                  triggers:\n                    - counter_trigger:\n                        counter: "activity"\n                        trigger: "grant_role"\n\n                  actions:\n                    add_roles: ["123456789123456789"] # Role ID for activity role\n\n                remove_activity_role:\n                  triggers:\n                    - counter_trigger:\n                        counter: "activity"\n                        trigger: "grant_role"\n                        reverse: true # This indicates we want to use the *reverse* of the specified trigger, see reverse_condition in counters above\n\n                  actions:\n                    remove_roles: ["123456789123456789"] # Role ID for activity role\n      ')])]},proxy:!0}])}),n._v(" "),t("h3",[n._v("Auto-disable antiraid")]),n._v(" "),t("p",[n._v("\n    This example disables antiraid after a specific delay.\n  ")]),n._v(" "),t("Expandable",{staticClass:"wide",scopedSlots:n._u([{key:"title",fn:function(){return[n._v("Click to view example")]},proxy:!0},{key:"content",fn:function(){return[t("CodeBlock",{attrs:{"code-lang":"yaml"}},[n._v('\n        plugins:\n\n          counters:\n            config:\n              counters:\n\n                antiraid_decay:\n                  triggers:\n                    disable:\n                      condition: "=0"\n                  decay:\n                    amount: 1\n                    every: 1m\n\n          automod:\n            config:\n              rules:\n\n                start_antiraid_timer_low:\n                  triggers:\n                    - antiraid_level:\n                        level: "low"\n                  actions:\n                    set_counter:\n                      counter: "antiraid_decay"\n                      amount: 10 # "Disable after 10min"\n\n                start_antiraid_timer_high:\n                  triggers:\n                    - antiraid_level:\n                        level: "high"\n                  actions:\n                    set_counter:\n                      counter: "antiraid_decay"\n                      amount: 20 # "Disable after 20min"\n\n                disable_antiraid_after_timer:\n                  triggers:\n                    - counter_trigger:\n                        counter: "antiraid_decay"\n                        trigger: "disable"\n                  actions:\n                    set_antiraid_level: null\n      ')])]},proxy:!0}])})],1)}),[],!1,null,null,null);e.default=s.exports}}]);
//# sourceMappingURL=7.6c3f32137192f26bcd0f.js.map