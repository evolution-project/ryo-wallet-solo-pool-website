(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["app"],{0:function(t,e,a){t.exports=a("2f39")},"034f":function(t,e,a){"use strict";var o=a("fb1c"),n=a.n(o);n.a},1743:function(t,e){},"1e5d":function(t,e,a){},"2f39":function(t,e,a){"use strict";a.r(e);var o={};a.r(o),a.d(o,"set_app_data",function(){return U}),a.d(o,"set_pool_data",function(){return W}),a.d(o,"set_worker_data",function(){return X});a("ac6a"),a("4a91"),a("a114"),a("d14b"),a("1e5d"),a("7e6d");var n=a("2b0e"),r=a("e84f"),s=a("7051"),c=a("2040"),i=a("cf12"),l=a("46a9"),u=a("32a1"),p=a("f30c"),d=a("ce67"),h=a("482e"),f=a("52b5"),m=a("1180"),b=a("1e55"),w=a("506f"),k=a("b8d9"),_=a("7d43"),g=a("9541"),y=a("0952"),v=a("2a70"),Q=a("79e9"),x=a("5d8b"),L=a("525b"),P=a("03d8"),T=a("c604"),I=a("62a9"),O=a("66d7"),S=a("7b38"),B=a("53fe"),j=a("206e"),M=a("b70a"),A=a("1526"),C=a("133b"),q=a("f9d8"),V=a("03b3");n["a"].use(r["a"],{config:{},components:{QLayout:s["a"],QLayoutHeader:c["a"],QLayoutDrawer:i["a"],QPageContainer:l["a"],QPage:u["a"],QToolbar:p["a"],QToolbarTitle:d["a"],QBtn:h["a"],QIcon:f["a"],QList:m["a"],QListHeader:b["a"],QItem:w["a"],QItemMain:k["a"],QItemSide:_["a"],QItemTile:g["a"],QModal:y["a"],QModalLayout:v["a"],QField:Q["a"],QInput:x["a"],QCheckbox:L["a"],QTooltip:P["a"],QTable:T["a"],QTh:I["a"],QTr:O["a"],QTd:S["a"],QTableColumns:B["a"],QInnerLoading:j["a"],QSpinner:M["a"]},directives:{Ripple:A["a"]},plugins:{Notify:C["a"],LocalStorage:q["a"],AddressbarColor:V["a"]}});var $=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"q-app"}},[a("router-view")],1)},E=[];$._withStripped=!0;var H=a("2f62"),J={name:"App",computed:Object(H["b"])({theme:function(t){return t.gateway.app.config.appearance.theme}}),watch:{theme:function(){"dark"==this.theme?document.body.classList.add("dark"):document.body.classList.remove("dark")}},mounted:function(){"dark"==this.theme?document.body.classList.add("dark"):document.body.classList.remove("dark")}},D=J,F=(a("034f"),a("2877")),N=Object(F["a"])(D,$,E,!1,null,null,null);N.options.__file="App.vue";var R=N.exports,z={app:{config:{appearance:{theme:"light"}}},pool:{stats:{hashrate:0,blockTime:0,lastBlock:{height:0,timestamp:0}},network_stats:{diff:0,hashrate:0,lastBlock:{height:0,timestamp:0}},hashrate:{solo:{},network:{}},blocks:[]},worker:{status:0,account:{address:"",scan_height:0},blocks:[]}},G=a("1743"),K=a("8365"),U=function(t,e){t.app=K.noMutate(t.app,e)},W=function(t,e){t.pool=K.noMutate(t.pool,e)},X=function(t,e){t.worker=K.noMutate(t.worker,e)},Y=a("5a98"),Z={namespaced:!0,state:z,getters:G,mutations:o,actions:Y};n["a"].use(H["a"]);var tt=new H["a"].Store({modules:{gateway:Z}}),et=tt,at=a("8c4f"),ot=[{path:"/",component:function(){return a.e("7ef1d7f4").then(a.bind(null,"d939"))},children:[{path:"",component:function(){return Promise.all([a.e("1f558c55"),a.e("762107df")]).then(a.bind(null,"4cdf"))}},{path:"dashboard",component:function(){return Promise.all([a.e("1f558c55"),a.e("762107df")]).then(a.bind(null,"4cdf"))}},{path:"worker-stats",component:function(){return Promise.all([a.e("1f558c55"),a.e("17777b27")]).then(a.bind(null,"c4f3"))}},{path:"blocks",component:function(){return Promise.all([a.e("1f558c55"),a.e("5abfa78d")]).then(a.bind(null,"3930"))}},{path:"getting-started",component:function(){return a.e("15c444dd").then(a.bind(null,"b827"))}},{path:"about",component:function(){return a.e("621712ba").then(a.bind(null,"7dd8"))}}]}];ot.push({path:"*",component:function(){return a.e("4b47640d").then(a.bind(null,"e51e"))}});var nt=ot;n["a"].use(at["a"]);var rt=function(){var t=new at["a"]({scrollBehavior:function(){return{y:0}},routes:nt,mode:"history",base:"/"});return t},st=function(){var t="function"===typeof et?et():et,e="function"===typeof rt?rt({store:t}):rt;t.$router=e;var a={el:"#q-app",router:e,store:t,render:function(t){return t(R)}};return{app:a,store:t,router:e}},ct=a("bc3a"),it=a.n(ct),lt=function(t){var e=t.Vue;e.prototype.$axios=it.a},ut=a("1dce"),pt=a.n(ut),dt=function(t){var e=t.Vue;e.use(pt.a)},ht=(a("f751"),a("3156")),ft=a.n(ht),mt=a("970b"),bt=a.n(mt),wt=a("5bc3"),kt=a.n(wt),_t=a("96a1"),gt=a("f355"),yt=gt[gt.network].explorer_url,vt=gt[gt.network].api_url,Qt=function(){function t(e,a){var o=this;bt()(this,t),this.app=e,this.router=a,V["a"].set("#63c9f3");var n=q["a"].has("theme")?q["a"].get.item("theme"):"dark";this.app.store.commit("gateway/set_app_data",{config:{appearance:{theme:n}}}),this.app.store.watch(function(t){return t.gateway.app.config.appearance.theme},function(t){q["a"].set("theme",t)});var r=120;setInterval(function(){return o.getStats()},1e3*r),this.getStats();var s=null;this.app.store.watch(function(t){return t.gateway.pool.blocks},function(t){if(null!=s&&t.length!=s){var e=t[0];C["a"].create({type:"positive",timeout:2e3,message:"Solo miner found block at height ".concat(e.height)})}s=t.length}),this.wallet=q["a"].has("wallet")?q["a"].get.item("wallet"):{},this.myBlocks=[]}return kt()(t,[{key:"getStats",value:function(){var t=this;it.a.get("".concat(vt,"/")).then(function(e){if(200==e.status&&e.hasOwnProperty("data")){var a=e.data;if(t.wallet.hasOwnProperty("address")&&t.wallet.hasOwnProperty("viewkey")){var o=t.wallet,n=o.address,r=o.viewkey;it.a.get("".concat(vt,"/account/").concat(n,"/").concat(r)).then(function(e){200==e.status&&e.hasOwnProperty("data")&&(e.data.error?(t.send("core","show_notification",{type:"negative",message:e.data.error.message}),t.app.store.commit("gateway/set_worker_data",{status:0})):(t.myBlocks=e.data.blocks.map(function(t){return t.hash}),t.app.store.commit("gateway/set_worker_data",ft()({},e.data,{quick_blocks:t.myBlocks,status:0})))),t.app.store.commit("gateway/set_pool_data",a)}).catch(function(e){t.app.store.commit("gateway/set_worker_data",{status:0}),t.app.store.commit("gateway/set_pool_data",a),console.log("API error - ".concat(vt)),console.log(e)})}else t.app.store.commit("gateway/set_pool_data",a)}}).catch(function(e){t.app.store.commit("gateway/set_worker_data",{status:0}),console.log("API error - ".concat(vt)),console.log(e)})}},{key:"send",value:function(t,e){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o={module:t,method:e,data:a};this.handle(o)}},{key:"handle",value:function(t){var e=t.data;switch(t.method){case"unset_wallet":q["a"].has("wallet")&&q["a"].remove("wallet"),this.wallet={},this.myBlocks=[],this.app.store.commit("gateway/set_worker_data",{status:0,account:{address:"",scan_height:0},blocks:[],quick_blocks:[]});break;case"set_wallet":e.save&&q["a"].set("wallet",e),this.wallet=e,this.getStats();break;case"show_notification":var a={type:"positive",timeout:1e3,message:""};C["a"].create(Object.assign(a,e));break;case"open_explorer":"tx"==e.type?Object(_t["a"])("".concat(yt,"/tx/").concat(e.id)):"block"==e.type&&Object(_t["a"])("".concat(yt,"/block/").concat(e.id));break;case"open_url":Object(_t["a"])(e.url);break}}}]),t}(),xt=function(t){var e=t.app,a=t.router,o=(t.store,t.Vue);o.prototype.$gateway=new Qt(e,a)},Lt=st(),Pt=Lt.app,Tt=Lt.store,It=Lt.router;[lt,dt,xt].forEach(function(t){t({app:Pt,router:It,store:Tt,Vue:n["a"],ssrContext:null})}),new n["a"](Pt)},"5a98":function(t,e){},"7e6d":function(t,e,a){},f355:function(t){t.exports={network:"mainnet",mainnet:{api_url:"https://solo-pool.ryoblocks.com/api",daemon_url:"http://127.0.0.1:12211",explorer_url:"https://explorer.ryo-currency.com",explorer_api_url:"http://127.0.0.1:8081",api_port:8117,start_height:235e3,refresh_interval:30},testnet:{api_url:"http://localhost:8117",daemon_url:"http://127.0.0.1:13311",explorer_url:"https://tnexp.ryoblocks.com",explorer_api_url:"https://tnexp.ryoblocks.com/api",api_port:8117,start_height:19e4,refresh_interval:30}}},fb1c:function(t,e,a){}},[[0,"runtime","vendor"]]]);