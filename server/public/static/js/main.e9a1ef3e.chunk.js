(this.webpackJsonpspotimon=this.webpackJsonpspotimon||[]).push([[0],{112:function(e,t,a){},113:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(36),i=a.n(r),o=(a(49),a(1)),l=a(2),c=a(5),u=a(4),h=a(6),d=a(17),m=a(3),p=a.n(m),v=a(12),f=a(42),y={"--b1":"#ffffff","--b2":"#e8e8e8","--b3":"#dedede","--b4":"#d1d1d1","--f1":"#000000","--s1":"#000000","--s2":"#FFFFFF","--s3":"#33C9FF","--s4":"#1DB954","--s5":"#1ED75F","--s6":"#5EAE59","--s7":"#2C2D4D"},g={"--b1":"#141414","--b2":"#1a1a1a","--b3":"#2b2b2b","--b4":"#3d3d3d","--f1":"#FFFFFF","--s1":"#000000","--s2":"#FFFFFF","--s3":"#33C9FF","--s4":"#1DB954","--s5":"#1ED75F","--s6":"#5EAE59","--s7":"#0A1136"},b=function(e){function t(){var e,a;Object(o.a)(this,t);for(var s=arguments.length,r=new Array(s),i=0;i<s;i++)r[i]=arguments[i];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).node=Object(n.createRef)(),a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.updateCSSVariables()}},{key:"componentDidUpdate",value:function(e){this.props.variables!==e.variables&&this.updateCSSVariables()}},{key:"updateCSSVariables",value:function(){var e=this;Object.entries(this.props.variables).forEach((function(t){var a=Object(f.a)(t,2),n=a[0],s=a[1];return e.node.current.style.setProperty(n,s)}))}},{key:"render",value:function(){var e=this.props.children;return s.a.createElement("div",{ref:this.node},e)}}]),t}(n.Component);b.Dark=g,b.Light=y;var k=b,O=function(){function e(){Object(o.a)(this,e)}return Object(l.a)(e,[{key:"getSavedDarkModeOnStatus",value:function(){var e=localStorage.getItem("darkModeOn");return null===e?(console.log("No theme data in browser local storage"),!0):e=JSON.parse(e)}},{key:"saveDarkModeOnStatus",value:function(e){localStorage.setItem("darkModeOn",e)}}]),e}(),E=a(16),C=function(){function e(t){Object(o.a)(this,e),this.isPlaying=!!t.isPlaying&&t.isPlaying,this.genre=t.genre,this.basslineMass=e.getDefaultBasslineMassFromGenreCount(this.genre.count),this.basslineRadius=e.getDefaultBasslineRadiusFromGenreCount(this.genre.count)}return Object(l.a)(e,null,[{key:"getDefaultBasslineMassFromGenreCount",value:function(e){return 30024584e-13*Math.pow(e,3.33)}},{key:"getDefaultBasslineRadiusFromGenreCount",value:function(e){return.5*e}}]),e}(),x=a(37),w=a.n(x),j=function(){function e(){Object(o.a)(this,e)}return Object(l.a)(e,null,[{key:"isPointWithinCircle",value:function(e,t,a,n,s){var r=s+5;return(e-a)*(e-a)+(t-n)*(t-n)<=r*r}}]),e}(),M=function(e){function t(){var e;return Object(o.a)(this,t),(e=Object(c.a)(this,Object(u.a)(t).call(this))).state={},e.animationId=null,e.isAnimating=!1,e.animate=e.animate.bind(Object(v.a)(e)),e.canvasMousePosition={x:-1,y:-1},e.currentMouseOverObject=null,e.canvas=null,e.setCanvas=function(t){e.canvas=t},e}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.canvasContext=this.canvas.getContext("2d")}},{key:"animate",value:function(){var e=this.props,t=e.simulationDriver,a=e.width,n=e.height;t.updatePositionVectors(),t.updateAccelerationVectors(),t.updateVelocityVectors(),this.canvasContext.clearRect(0,0,a,n);for(var s=0;s<t.masses.length;s++){var r=t.masses[s],i=a/2+r.spatial.x*t.scale,o=n/2+r.spatial.y*t.scale;r.manifestation.draw(this.canvasContext,i,o),r.domain.genre.name&&(this.canvasContext.fillStyle="white",this.canvasContext.font="16px Arial",this.canvasContext.fillText(r.domain.genre.name,i+r.manifestation.radius+2,o-r.manifestation.radius-2));var l=a/2/t.scale;if(r.spatial.x<-l)r.spatial.x=l,r.spatial.y*=-1,r.spatial.vx/=2;else if(r.spatial.x>l)r.spatial.x=-l,r.spatial.y*=-1,r.spatial.vx/=2;else{var c=n/2/t.scale;r.spatial.y<-c?(r.spatial.y=c,r.spatial.x*=-1,r.spatial.vy/=2):r.spatial.y>c&&(r.spatial.y=-c,r.spatial.x*=-1,r.spatial.vy/=2)}}this.animationId=requestAnimationFrame(this.animate)}},{key:"handleCanvasMouseMove",value:function(e){var t=e.nativeEvent,a=t.offsetX,n=t.offsetY;this.canvasMousePosition.x=a,this.canvasMousePosition.y=n;for(var s=this.props,r=s.simulationDriver,i=s.onGravitationalObjectMouseEnter,o=s.onGravitationalObjectMouseLeave,l=null,c=r.masses.length,u=0;u<c;u++)for(var h=r.masses[u],d=0;d<h.manifestation.positions.length;d++){var m=d/h.manifestation.positions.length,p=h.manifestation.positions[d];if(j.isPointWithinCircle(this.canvasMousePosition.x,this.canvasMousePosition.y,p.x,p.y,m*h.manifestation.radius)){l=h;break}if(l)break}l&&this.currentMouseOverObject!==l&&(this.currentMouseOverObject=l,i(l)),!l&&this.currentMouseOverObject&&(o(this.currentMouseOverObject),this.currentMouseOverObject=null)}},{key:"handleCanvasMouseClick",value:function(e){for(var t=this.props,a=t.simulationDriver,n=t.onGravitationalObjectClick,s=e.nativeEvent.offsetX,r=e.nativeEvent.offsetY,i=a.masses.length,o=!1,l=null,c=0;c<i;c++){for(var u=a.masses[c],h=0;h<u.manifestation.positions.length;h++){var d=u.manifestation.positions[h],m=h/u.manifestation.positions.length;if(j.isPointWithinCircle(s,r,d.x,d.y,u.manifestation.radius*m)){console.log("clicked",u),o=!0,l=u;break}}if(o)break}o&&n(l)}},{key:"setAnimation",value:function(e){e&&!this.isAnimating&&(this.animationId=requestAnimationFrame(this.animate),this.isAnimating=!0),!e&&this.isAnimating&&(cancelAnimationFrame(this.animationId),this.isAnimating=!1,this.animationId=null)}},{key:"render",value:function(){var e=this,t=this.props,a=t.isEnabled,n=t.width,r=t.height,i=t.canvasClickable,o=t.backgroundColor,l=t.cursor;return this.setAnimation(a),s.a.createElement("div",{style:{cursor:i?"pointer":"default"}},s.a.createElement("canvas",{ref:this.setCanvas,onMouseMove:function(t){return e.handleCanvasMouseMove(t)},onClick:function(t){return p.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,p.a.awrap(e.handleCanvasMouseClick(t));case 2:return a.abrupt("return",a.sent);case 3:case"end":return a.stop()}}))},style:{backgroundColor:o,cursor:l},width:n,height:r}))}}]),t}(n.Component),S=function(){function e(t){Object(o.a)(this,e),this.g=t.g,this.dt=t.dt,this.softeningConstant=t.softeningConstant,this.masses=t.masses,this.scale=t.scale}return Object(l.a)(e,[{key:"updatePositionVectors",value:function(){for(var e=this.masses.length,t=0;t<e;t++){var a=this.masses[t].spatial;a.x+=a.vx*this.dt,a.y+=a.vy*this.dt,a.z+=a.vz*this.dt}return this}},{key:"updateVelocityVectors",value:function(){for(var e=this.masses.length,t=0;t<e;t++){var a=this.masses[t].spatial;a.vx+=a.ax*this.dt,a.vy+=a.ay*this.dt,a.vz+=a.az*this.dt}}},{key:"updateAccelerationVectors",value:function(){for(var e=this.masses.length,t=0;t<e;t++){for(var a=0,n=0,s=0,r=this.masses[t].spatial,i=0;i<e;i++)if(t!==i){var o=this.masses[i].spatial,l=o.x-r.x,c=o.y-r.y,u=o.z-r.z,h=l*l+c*c+u*u,d=this.g*o.m/(h*Math.sqrt(h+this.softeningConstant));a+=l*d,n+=c*d,s+=u*d}r.ax=a,r.ay=n,r.az=s}return this}}]),e}(),D=function e(t){Object(o.a)(this,e),this.name=t.name,this.m=t.m,this.x=t.x,this.y=t.y,this.z=t.z,this.vx=t.vx,this.vy=t.vy,this.vz=t.vz,this.ax=t.ax,this.ay=t.ay,this.az=t.az},T=function(){function e(t,a){Object(o.a)(this,e),this.domain=a,this.trailLength=t.trailLength,this.radius=t.radius,this.hasRing=t.hasRing,this.primaryColor={r:Math.floor(256*Math.random()),g:Math.floor(256*Math.random()),b:Math.floor(256*Math.random())},this.positions=[],this.storePosition=this.storePosition.bind(this)}return Object(l.a)(e,[{key:"storePosition",value:function(e,t){this.positions.push({x:e,y:t}),this.positions.length>this.trailLength&&this.positions.shift()}},{key:"draw",value:function(e,t,a){this.storePosition(t,a);for(var n=this.positions.length,s=0;s<n;s++){var r=void 0,i=void 0,o=s/n;s===n-1?(r=1,i=1):(r=o/2,i=o);var l=this.primaryColor,c=l.r,u=l.g,h=l.b;s===n-1&&(this.domain.isPlaying&&(e.beginPath(),e.arc(this.positions[s].x,this.positions[s].y,this.radius+1*this.radius,0,2*Math.PI),e.fillStyle="rgb(255, 250, 33, 0.1)",e.fill(),e.beginPath(),e.arc(this.positions[s].x,this.positions[s].y,this.radius+.7*this.radius,0,2*Math.PI),e.fillStyle="rgb(255, 250, 33, 0.1)",e.fill(),e.beginPath(),e.arc(this.positions[s].x,this.positions[s].y,this.radius+.4*this.radius,0,2*Math.PI),e.fillStyle="rgb(255, 250, 33, 0.1)",e.fill()),this.hasRing&&(e.beginPath(),e.arc(this.positions[s].x,this.positions[s].y,1*this.radius+.25*this.radius,0,2*Math.PI),e.strokeStyle="rgb(".concat(c,", ").concat(u,", ").concat(h,", ",1,")"),e.lineWidth=2,e.stroke()),e.beginPath(),e.arc(this.positions[s].x,this.positions[s].y,i*this.radius,0,2*Math.PI),e.fillStyle="rgb(".concat(c,", ").concat(u,", ").concat(h,", ").concat(r,")"),e.fill())}}}]),e}(),P=function e(t,a,n){Object(o.a)(this,e),this.spatial=new D(t),this.domain=new C(n),this.manifestation=new T(a,this.domain)},N=function(){function e(){Object(o.a)(this,e)}return Object(l.a)(e,null,[{key:"getRandomGravitationalObjectData",value:function(){var e=Math.random()>.5,t=Math.random()>.5,a=Math.random()>.5,n=Math.random()>.5,s=Math.random()>.5,r=Math.random()>.5,i=2*Math.random(),o=2*Math.random(),l=4*Math.random(),c=4*Math.random(),u=1*Math.random(),h=1*Math.random();return a&&(l*=-1),n&&(c*=-1),e&&(i*=-1),t&&(o*=-1),s&&(u*=-1),r&&(h*=-1),{x:i,y:o,z:0,vx:l,vy:c,vz:0,ax:u,ay:h,az:0}}},{key:"geNBodyItemsFromUniqueGenreData",value:function(t){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:8,n=Math.min(25,t.length),s=n.length/4,r=3*(s-1),i=t.slice(0,r),o=t.slice(r,n-1),l=i.concat(o),c=[],u=!0,h=!1,d=void 0;try{for(var m,p=l[Symbol.iterator]();!(u=(m=p.next()).done);u=!0){var v=m.value,f=C.getDefaultBasslineMassFromGenreCount(v.count),y={defaultMass:f,trailLength:a,radius:C.getDefaultBasslineRadiusFromGenreCount(v.count),hasRing:Math.random()>.6},g=Object(E.a)({m:f},e.getRandomGravitationalObjectData()),b={genre:v},k=new P(g,y,b);c.push(k)}}catch(O){h=!0,d=O}finally{try{u||null==p.return||p.return()}finally{if(h)throw d}}return c}}]),e}(),F=function(){function e(){Object(o.a)(this,e)}return Object(l.a)(e,null,[{key:"getAbsoluteHeight",value:function(e){var t=window.getComputedStyle(e),a=parseFloat(t.marginTop)+parseFloat(t.marginBottom);return Math.ceil(e.offsetHeight+a)}},{key:"getAbsoluteWidth",value:function(e){var t=window.getComputedStyle(e),a=parseFloat(t.marginLeft)+parseFloat(t.marginRight);return Math.ceil(e.offsetWidth+a)}}]),e}(),A=function(){function e(){Object(o.a)(this,e)}return Object(l.a)(e,null,[{key:"getWeightedVolumeAverageForSegment",value:function(e,t,a){var n=t.reduce((function(e,t){return e+t}),0)/t.length,s=Math.abs(e.loudness_start/n);return.4*Math.abs(e.loudness_start/t[t.length-1])+.4*s+.2*Math.pow(Math.abs(a/e.loudness_start),1.7)}}]),e}(),I=(a(86),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={value:50,min:1,max:100},a.handleInput=a.handleInput.bind(Object(v.a)(a)),a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=this.props,t=e.min,a=e.max,n=e.value,s=e.step;this.setState({step:s}),this.setState({min:t}),this.setState({max:a}),this.setState({value:n})}},{key:"handleInput",value:function(e){console.log("test",e.target.value);var t=this.props.onChange;this.setState({value:e.target.value}),t&&t(e.target.value)}},{key:"render",value:function(){var e=this,t=this.state,a=t.min,n=t.max,r=t.value,i=t.step;return s.a.createElement("div",{className:"slidecontainer"},s.a.createElement("input",{step:i,onChange:function(t){return e.handleInput(t)},type:"range",min:a,max:n,value:r,className:"slider"}))}}]),t}(n.Component)),G=(a(87),function(){return s.a.createElement("div",{className:"spinner"})}),R=a(15),B=39.5,z=5e-4,W=.15,H=70,L=function(e){function t(){var e;return Object(o.a)(this,t),(e=Object(c.a)(this,Object(u.a)(t).call(this))).state={simulatorEnabled:!1,simulationWidth:0,simulationHeight:0,simulationCursor:"default",currentUris:[],playlistStartOffset:0,fetchingGenres:!1,currentTrackData:{id:"",playlist:null,analysis:null,progressInSeconds:0,recentLoudnessData:[]},playRequested:!1,playing:!1},e.handleWindowResize=e.handleWindowResize.bind(Object(v.a)(e)),e.onCurrentlyPlayingCheckIn=e.onCurrentlyPlayingCheckIn.bind(Object(v.a)(e)),e.checkInTimerId=null,e.page=null,e.setPage=function(t){e.page=t},e.canvas=null,e.setCanvas=function(t){e.canvas=t},e.header=null,e.setHeader=function(t){e.header=t},e.footer=null,e.setFooter=function(t){e.footer=t},e.simulationDriver=new S({g:B,dt:z,masses:[],softeningConstant:W,scale:H}),e}return Object(h.a)(t,e),Object(l.a)(t,[{key:"setSimulatorSize",value:function(){this.page&&(this.setState({simulatorWidth:F.getAbsoluteWidth(this.page)}),this.setState({simulatorHeight:.99*F.getAbsoluteHeight(this.page)-F.getAbsoluteHeight(this.header)-F.getAbsoluteHeight(this.footer)}))}},{key:"componentDidMount",value:function(){return p.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.props.accessToken){e.next=2;break}return e.abrupt("return");case 2:return this.setSimulatorSize(),window.addEventListener("resize",this.handleWindowResize),new ResizeObserver(this.handleWindowResize).observe(this.footer),e.next=7,p.a.awrap(this.fetchGenres());case 7:case"end":return e.stop()}}),null,this)}},{key:"handleWindowResize",value:function(){this.setSimulatorSize()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.handleWindowResize)}},{key:"handleGetNowPlaying",value:function(){var e,t;return p.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return e=this.props.spotifyClient,a.next=3,p.a.awrap(e.getNowPlayingAsync());case 3:(t=a.sent)&&this.setState({nowPlaying:t});case 5:case"end":return a.stop()}}),null,this)}},{key:"fetchGenres",value:function(){var e,t,a,n;return p.a.async((function(s){for(;;)switch(s.prev=s.next){case 0:return e=[],t=this.props.spotifyClient,this.setState({fetchingGenres:!0}),s.prev=3,s.next=6,p.a.awrap(t.getSavedTracksAsync(300));case 6:return(a=s.sent).length<20&&this.props.history.push({pathname:"/issue",state:{issueHeader:"You must have at least 20 liked / saved songs to continue."}}),s.next=10,p.a.awrap(t.getArtistsFromTracksAsync(a));case 10:n=s.sent,e=t.getUniqueGenreDataFromArtists(n),s.next=19;break;case 14:return s.prev=14,s.t0=s.catch(3),console.error(s.t0),this.props.history.push({pathname:"/issue",state:{issueHeader:"You must have at least 20 liked / saved songs to continue.",issueBody:s.t0}}),s.abrupt("return");case 19:return s.prev=19,this.setState({fetchingGenres:!1}),s.finish(19);case 22:this.simulationDriver.masses=N.geNBodyItemsFromUniqueGenreData(e,8),this.setState({simulatorEnabled:!0});case 24:case"end":return s.stop()}}),null,this,[[3,14,19,22]])}},{key:"handleGenreClick",value:function(e){var t,a,n,s,r,i;return p.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return t=this.props.spotifyClient,a=e.domain.genre.name,o.next=4,p.a.awrap(t.searchPlaylists("the sound of ".concat(a)));case 4:return n=o.sent,s=n.playlists.items[0],r=Math.min(Math.floor(100*Math.random()),Math.floor(Math.random()*s.tracks.total-1)),o.next=9,p.a.awrap(t.getPlaylistTracks(s.id,{offset:r}));case 9:i=o.sent,i.items[0].track,this.setState({playlistStartOffset:r}),this.setState({currentUris:[s.uri]}),this.setState({playRequested:!0}),this.resetIsPlaying(),e.domain.isPlaying=!0;case 16:case"end":return o.stop()}}),null,this)}},{key:"handleGenreMouseEnter",value:function(e){this.setState({simulationCursor:"pointer"})}},{key:"handleGenreMouseLeave",value:function(e){this.setState({simulationCursor:"default"})}},{key:"handlePlayerStatusChange",value:function(e){var t,a,n,s;return p.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:if(console.log("Player Status",e),e.error&&this.props.history.push({pathname:"/issue",state:{issueHeader:"Spotify player error - Type: ".concat(e.errorType,", Error: ").concat(e.error)}}),t=this.state.playing,this.setState({playing:e.isPlaying}),a=0,this.state.currentTrackData.id==e.track.id){r.next=17;break}return n=new Date,r.prev=7,r.next=10,p.a.awrap(this.updateCurrentTrackDataFromIdAsync(e.track.id));case 10:r.next=15;break;case 12:r.prev=12,r.t0=r.catch(7),console.error(r.t0);case 15:s=new Date,a=(s.getTime()-n.getTime())/100;case 17:e.isPlaying&&(this.setState({currentTrackData:Object(E.a)({},this.state.currentTrackData,{progressInSeconds:e.position+a})}),t||(this.checkInTimerId=setInterval(this.onCurrentlyPlayingCheckIn,200))),e.isPlaying||(clearInterval(this.checkInTimerId),this.setState({playRequested:!1}));case 19:case"end":return r.stop()}}),null,this,[[7,12]])}},{key:"updateCurrentTrackDataFromIdAsync",value:function(e){var t,a,n,s,r,i;return p.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:return t=this.props.spotifyClient,o.prev=1,o.next=4,p.a.awrap(t.getAudioAnalysisForTrack(e));case 4:return a=o.sent,o.next=7,p.a.awrap(t.getMyCurrentPlayingTrack());case 7:if(n=o.sent,s=null,"playlist"!=n.context.type){o.next=14;break}return r=n.context.uri.split("playlist:")[1],o.next=13,p.a.awrap(t.getPlaylist(r));case 13:s=o.sent;case 14:i=Object(E.a)({},this.state.currentTrackData,{id:e,analysis:a,progressInSeconds:0,playlist:s}),this.setState({currentTrackData:i}),o.next=22;break;case 18:return o.prev=18,o.t0=o.catch(1),console.error("Issue grabbing track data",o.t0),o.abrupt("return");case 22:case"end":return o.stop()}}),null,this,[[1,18]])}},{key:"onCurrentlyPlayingCheckIn",value:function(){var e=Object(E.a)({},this.state.currentTrackData);e.progressInSeconds+=.2,this.setState({currentTrackData:e}),this.updateAudioAnalysisVisualizationEffects()}},{key:"updateAudioAnalysisVisualizationEffects",value:function(){var e=Object(E.a)({},this.state.currentTrackData);if(e.analysis){var t=e.analysis.segments.filter((function(t){return t.start<=e.progressInSeconds&&t.start+t.duration>e.progressInSeconds}))[0];if(t){var a=1,n=e.analysis.track.loudness,s=e.recentLoudnessData;s.length>=6&&(a=A.getWeightedVolumeAverageForSegment(t,s,n)),this.simulationDriver.dt=3*z*a;var r=this.simulationDriver.masses.filter((function(e){return e.domain.isPlaying}))[0];r&&(isNaN(a)||(r.manifestation.radius=r.domain.basslineRadius+1*r.domain.basslineRadius*a)),s.push(t.loudness_start),s.count>6&&s.pop()}}}},{key:"resetIsPlaying",value:function(){for(var e=0;e<this.simulationDriver.masses.length-1;e++){this.simulationDriver.masses[e].domain.isPlaying=!1}}},{key:"handleDeltaTChange",value:function(e){z=e,this.simulationDriver.dt=e}},{key:"handleMassChange",value:function(e){for(var t=0;t<this.simulationDriver.masses.length-1;t++){var a=this.simulationDriver.masses[t],n=C.getDefaultBasslineMassFromGenreCount(a.domain.genre.count)*e,s=C.getDefaultBasslineRadiusFromGenreCount(a.domain.genre.count)*e;a.domain.basslineMass=n,a.domain.basslineRadius=s,a.spatial.m=n,a.manifestation.radius=s}}},{key:"handlePlaylistClick",value:function(){var e=this.state.currentTrackData,t="";e.playlist&&e.playlist.external_urls&&(t=e.playlist.external_urls.spotify),t&&window.open(t,"_newtab")}},{key:"render",value:function(){var e=this,t=this.state,a=t.simulationCursor,n=t.simulatorEnabled,r=t.simulatorWidth,i=t.simulatorHeight,o=t.playlistStartOffset,l=t.canvasClickable,c=t.currentUris,u=t.currentTrackData,h=t.playRequested,d=t.playing,m=t.fetchingGenres,v=this.props.accessToken,f="";u.playlist&&u.playlist.images&&(f=u.playlist.images[0].url);var y="";return u.playlist&&(y=u.playlist.name),s.a.createElement("div",{style:{width:"100%",height:"100%"}},s.a.createElement("div",{style:{visibility:m?"visible":"hidden"},className:"spinner-container"},s.a.createElement(G,null)),s.a.createElement("div",{className:"simulator-container dashboard-text",style:{width:"100%",height:"100%"},ref:this.setPage},s.a.createElement("div",{style:{cursor:l?"pointer":"default"}},s.a.createElement(M,{simulationDriver:this.simulationDriver,isEnabled:n,backgroundColor:"var(--s7)",width:r,height:i,cursor:a,onGravitationalObjectClick:function(t){return p.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",e.handleGenreClick(t));case 1:case"end":return a.stop()}}))},onGravitationalObjectMouseEnter:function(t){return e.handleGenreMouseEnter(t)},onGravitationalObjectMouseLeave:function(t){return e.handleGenreMouseLeave(t)}})),s.a.createElement("div",{className:"dashboard-area standard-text",ref:this.setHeader},d&&u.playlist&&s.a.createElement("div",{className:"dashboard-info-area playlist-section"},s.a.createElement("div",{onClick:this.handlePlaylistClick.bind(this),className:"dashboard-section-left playlist-section"},s.a.createElement("img",{alt:"playlist",style:{backgroundGolor:"green"},width:"40",height:"40",src:f}),s.a.createElement("div",{style:{marginLeft:"4px"}},s.a.createElement("label",{style:{cursor:"inherit"}},"Playlist"),s.a.createElement("br",null),s.a.createElement("label",{style:{cursor:"inherit"}},y)))),s.a.createElement("div",{className:"dashboard-c1-area"},s.a.createElement("div",{className:"dashboard-section-center"},s.a.createElement("label",null,"Time"),s.a.createElement("br",null),s.a.createElement(I,{step:1e-6,min:1e-5,value:5e-4,max:.002,onChange:this.handleDeltaTChange.bind(this),style:{margin:"10px"}}))),s.a.createElement("div",{className:"dashboard-c2-area"},s.a.createElement("div",{className:"dashboard-section-center"},s.a.createElement("label",null,"Mass"),s.a.createElement("br",null),s.a.createElement(I,{step:.1,min:.1,value:1,max:3,onChange:this.handleMassChange.bind(this),style:{margin:"10px"}})))),s.a.createElement("div",{ref:this.setFooter},s.a.createElement(w.a,{styles:{loaderColor:"var(--f1)",sliderHandleColor:"var(--f1)",sliderTrackColor:"var(--b3)",bgColor:"var(--b2)",color:"var(--f1)",trackNameColor:"var(--f1)",trackArtistColor:"var(--f1)"},showSaveIcon:!0,offset:o,callback:function(t){return p.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",e.handlePlayerStatusChange(t));case 1:case"end":return a.stop()}}))},play:h,uris:c,token:v}))))}}]),t}(n.Component),V=Object(R.g)(L),_=a(40),q=(a(93),function(e){var t=e.children,a=e.className,n=e.onClick,r=Object(_.a)(e,["children","className","onClick"]);return s.a.createElement("button",Object.assign({onClick:n,className:"standardButton "+a},r),t)});var U="".concat("https://spotimon.com",":").concat("80").concat("/api/"),Y="".concat(U,"auth/login"),J=function(){return s.a.createElement("div",{className:"enter-container"},s.a.createElement("div",{className:"banner-area"},s.a.createElement("h2",{className:"banner-text standard-text"},"The Universe Bumps With You")),s.a.createElement("div",{className:"preview-area"},s.a.createElement("video",{className:"preview-video",width:"100%",height:"100%",id:"preview",muted:!0,preload:"auto",autoPlay:!0,loop:"loop",style:{objectFit:"cover"}},s.a.createElement("source",{src:"/Videos/preview.mp4",type:"video/mp4"}))),s.a.createElement("div",{className:"info-area"},s.a.createElement("ul",{className:"standard-text info-list"},s.a.createElement("li",null,"Requirements",s.a.createElement("ul",null,s.a.createElement("li",null,"Spotify Premium"),s.a.createElement("li",null,'"Liked Songs" Playlist must have content.'))),s.a.createElement("li",null,"What Is This?",s.a.createElement("ul",null,s.a.createElement("li",null,"Explore your most and least frequented genres."),s.a.createElement("li",null,"Discover something new in your sposmos."),s.a.createElement("li",null,"Visualize your tunes."))))),s.a.createElement("div",{className:"enter-area"},s.a.createElement("div",{className:"enter-button-container"},s.a.createElement("a",{href:Y},s.a.createElement(q,null,"Login With Spotify")))))},X=function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).state={},a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{style:{margin:"10px"},className:"center-wrapper"},s.a.createElement("h1",null,"Not Found :("))}}]),t}(n.Component),$=function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).state={},a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"container"},s.a.createElement("div",{className:"header",style:{backgroundColor:"red"}},"HEADER"),s.a.createElement("div",{className:"menu ",style:{backgroundColor:"green"}},"MENU"),s.a.createElement("div",{className:"content",style:{backgroundColor:"tomato",height:"968px"}},s.a.createElement(G,null)),s.a.createElement("div",{className:"footer",style:{backgroundColor:"purple"}},"FOOTER"))}}]),t}(n.Component),K=(a(94),function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(c.a)(this,Object(u.a)(t).call(this,e))).state={isOpen:!1},a.navBar=null,a.setNavBarRef=function(e){a.navBar=e},a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){document.addEventListener("mousedown",this.handleGlobalClick.bind(this))}},{key:"componentWillUnmount",value:function(){document.removeEventListener("mousedown",this.handleGlobalClick.bind(this))}},{key:"handleGlobalClick",value:function(e){this.navBar&&!this.navBar.contains(e.target)&&this.setState({isOpen:!1})}},{key:"handleNavBarClick",value:function(){this.setState({isOpen:!this.state.isOpen})}},{key:"handleTitleBarClick",value:function(){this.state.isOpen&&this.setState({isOpen:!1})}},{key:"render",value:function(){var e=this.props.onThemeClick;return s.a.createElement("div",{ref:this.setNavBarRef,className:"nav"},s.a.createElement("input",{type:"checkbox",id:"nav-check",onChange:this.handleNavBarClick.bind(this),checked:this.state.isOpen}),s.a.createElement("div",{className:"nav-header"},s.a.createElement(d.b,{onClick:this.handleTitleBarClick.bind(this),to:"/",style:{textDecoration:"none"},className:"nav-title"},"spotimon")),s.a.createElement("div",{className:"nav-btn"},s.a.createElement("label",{htmlFor:"nav-check"},s.a.createElement("span",null),s.a.createElement("span",null),s.a.createElement("span",null))),s.a.createElement("div",{className:"nav-links",onClick:this.handleNavBarClick.bind(this)},s.a.createElement("a",{rel:"noopener noreferrer",target:"_blank",href:"http://www.nickprovs.com"},"Author"),s.a.createElement("a",{style:{cursor:"pointer"},onClick:e},"Theme")))}}]),t}(n.Component)),Q=function(){function e(){Object(o.a)(this,e)}return Object(l.a)(e,null,[{key:"getUrlHashParams",value:function(){for(var e,t={},a=/([^&;=]+)=?([^&;]*)/g,n=window.location.hash.substring(1);e=a.exec(n);)t[e[1]]=decodeURIComponent(e[2]);return t}}]),e}(),Z=function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(a=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).state={},a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{style:{margin:"10px"},className:"center-wrapper"},s.a.createElement("h1",null,"Callback"),s.a.createElement("br",null),s.a.createElement("h1",null,"Preparing to redirect..."))}},{key:"componentDidMount",value:function(){var e=Q.getUrlHashParams();this.props.onCallback(e)}}]),t}(n.Component),ee=function(e){var t=e.history,a="Issue",n="";return t.location.state&&t.location.state.issueHeader&&(a=t.location.state.issueHeader),t.location.state&&t.location.state.issueBody&&(n=t.location.state.issueBody),s.a.createElement("div",{style:{margin:"10px"},className:"center-wrapper"},s.a.createElement("h1",{className:"standard-text"},a),s.a.createElement("br",null),s.a.createElement("h1",{className:"standard-text"},n))},te=a(43),ae=a(41),ne=function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(l.a)(t,[{key:"isLoggedIn",value:function(){return!0===this.getAccessToken()}},{key:"getSavedTracksAsync",value:function(){var e,t,a,n,s,r,i,o=arguments;return p.a.async((function(l){for(;;)switch(l.prev=l.next){case 0:return e=o.length>0&&void 0!==o[0]?o[0]:300,t=[],l.prev=2,a=Math.min(50,e),l.next=6,p.a.awrap(this.getMySavedTracks());case 6:n=l.sent,s=n.total,r=0;case 9:if(!(r*a<e&&r*a<s)){l.next=17;break}return l.next=12,p.a.awrap(this.getMySavedTracks({offset:r*a,limit:a}));case 12:i=l.sent,t.push.apply(t,Object(te.a)(i.items.map((function(e){return e.track}))));case 14:r++,l.next=9;break;case 17:l.next=22;break;case 19:l.prev=19,l.t0=l.catch(2),console.log(l.t0);case 22:return l.abrupt("return",t);case 23:case"end":return l.stop()}}),null,this,[[2,19]])}},{key:"getArtistsFromTracksAsync",value:function(e){var t,a,n,s,r,i,o,l;return p.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:t=[],c.prev=1,a=!0,n=!1,s=void 0,c.prev=5,r=e[Symbol.iterator]();case 7:if(a=(i=r.next()).done){c.next=16;break}return o=i.value,c.next=11,p.a.awrap(this.getArtist(o.artists[0].id));case 11:l=c.sent,t.push(l);case 13:a=!0,c.next=7;break;case 16:c.next=22;break;case 18:c.prev=18,c.t0=c.catch(5),n=!0,s=c.t0;case 22:c.prev=22,c.prev=23,a||null==r.return||r.return();case 25:if(c.prev=25,!n){c.next=28;break}throw s;case 28:return c.finish(25);case 29:return c.finish(22);case 30:c.next=35;break;case 32:c.prev=32,c.t1=c.catch(1),console.log(c.t1);case 35:return c.abrupt("return",t);case 36:case"end":return c.stop()}}),null,this,[[1,32],[5,18,22,30],[23,,25,29]])}},{key:"getUniqueGenreDataFromArtists",value:function(e){var t={},a=!0,n=!1,s=void 0;try{for(var r,i=e[Symbol.iterator]();!(a=(r=i.next()).done);a=!0){var o=r.value,l=!0,c=!1,u=void 0;try{for(var h,d=o.genres[Symbol.iterator]();!(l=(h=d.next()).done);l=!0){var m=h.value;t[m]?t[m]++:t[m]=1}}catch(f){c=!0,u=f}finally{try{l||null==d.return||d.return()}finally{if(c)throw u}}}}catch(f){n=!0,s=f}finally{try{a||null==i.return||i.return()}finally{if(n)throw s}}var p=[];for(var v in t)p.push({name:v,count:t[v]});return p.sort((function(e,t){return t.count-e.count})),p}},{key:"getNowPlayingAsync",value:function(){var e;return p.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,p.a.awrap(this.getMyCurrentPlaybackState());case 3:return e=t.sent,t.abrupt("return",{name:e.item.name,image:e.item.album.images[0].url});case 7:t.prev=7,t.t0=t.catch(0),console.log(t.t0);case 10:case"end":return t.stop()}}),null,this,[[0,7]])}}]),t}(a.n(ae).a),se=a(18),re=a.n(se);re.a.interceptors.response.use(null,(function(e){return e.response&&e.response.status>=400&&e.response.status<500||(console.log("Logging the error",e),alert("An unexpected error occured.")),Promise.reject(e)}));var ie={get:re.a.get,post:re.a.post,put:re.a.put,delete:re.a.delete},oe="".concat(U,"auth/"),le="refresh_token";var ce={getNewAccessToken:function(e){var t;return p.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return t=oe+le+"?refresh_token="+e,a.next=3,p.a.awrap(ie.get(t));case 3:return a.abrupt("return",a.sent);case 4:case"end":return a.stop()}}))}},ue=function(e){function t(){var e;return Object(o.a)(this,t),(e=Object(c.a)(this,Object(u.a)(t).call(this))).state={darkModeOn:!0,accessToken:""},e.theming=new O,e.refreshToken="",e.spotifyClient=new ne,e.handleTokenTimeout=e.handleTokenTimeout.bind(Object(v.a)(e)),e}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){this.setState({darkModeOn:this.theming.getSavedDarkModeOnStatus()}),this.redirectIfOnInvalidPageForState()}},{key:"redirectIfOnInvalidPageForState",value:function(){console.log("mounted at",this.props.location.pathname),"/simulation"!==this.props.location.pathname||this.state.accessToken||this.props.history.push({pathname:"/begin"})}},{key:"handleToggleTheme",value:function(){var e=!this.state.darkModeOn;this.setState({darkModeOn:e}),this.theming.saveDarkModeOnStatus(e)}},{key:"handleCallback",value:function(e){var t;return p.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return e.access_token&&e.refresh_token||this.props.history.push({pathname:"/issue",state:{issueHeader:"Data was not passed from spotify callback."}}),this.spotifyClient.setAccessToken(e.access_token),t=null,a.prev=3,a.next=6,p.a.awrap(this.spotifyClient.getMe());case 6:t=a.sent,a.next=13;break;case 9:return a.prev=9,a.t0=a.catch(3),this.props.history.push({pathname:"/issue",state:{issueHeader:"Could not retrieve user profile."}}),a.abrupt("return");case 13:if(t){a.next=16;break}return this.props.history.push({pathname:"/issue",state:{issueHeader:"Could not retrieve user profile."}}),a.abrupt("return");case 16:if("premium"===t.product){a.next=19;break}return this.props.history.push({pathname:"/issue",state:{issueHeader:"Spotify premium is required for this app.",issueBody:" Sign out of the current non-premium account through spotify if you have a premium account."}}),a.abrupt("return");case 19:this.setState({accessToken:e.access_token}),this.refreshToken=e.refresh_token,this.props.history.push({pathname:"/simulation"}),setInterval(this.handleTokenTimeout,35e5);case 23:case"end":return a.stop()}}),null,this,[[3,9]])}},{key:"handleTokenTimeout",value:function(){var e,t;return p.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return console.log("going to try and request a new token"),a.prev=1,a.next=4,p.a.awrap(ce.getNewAccessToken(this.refreshToken));case 4:e=a.sent,t=e.data.access_token,this.setState({accessToken:t}),this.spotifyClient.setAccessToken(t),a.next=14;break;case 10:return a.prev=10,a.t0=a.catch(1),this.props.history.push({pathname:"/issue",state:{issueHeader:"Couldn't refresh spotify authentication. Please navigate to the home page and try again."}}),a.abrupt("return");case 14:case"end":return a.stop()}}),null,this,[[1,10]])}},{key:"render",value:function(){var e=this,t=this.state.darkModeOn?k.Dark:k.Light,a=this.state.accessToken;return s.a.createElement("div",null,s.a.createElement(k,{variables:t},s.a.createElement("div",{className:"app-container"},s.a.createElement("div",{className:"nav-area"},s.a.createElement(K,{onThemeClick:this.handleToggleTheme.bind(this)})),s.a.createElement("div",{className:"content-area"},s.a.createElement(R.d,null,s.a.createElement(R.b,{path:"/playground",render:function(e){return s.a.createElement($,null)}}),s.a.createElement(R.b,{path:"/simulation",render:function(t){return s.a.createElement(V,{spotifyClient:e.spotifyClient,accessToken:a})}}),s.a.createElement(R.b,{path:"/begin",render:function(e){return s.a.createElement(J,null)}}),s.a.createElement(R.b,{path:"/callback",render:function(t){return s.a.createElement(Z,{onCallback:e.handleCallback.bind(e)})}}),s.a.createElement(R.b,{path:"/issue",component:ee}),s.a.createElement(R.b,{path:"/not-found",render:function(e){return s.a.createElement(X,null)}}),s.a.createElement(R.a,{exact:!0,from:"/",to:"/begin"}),s.a.createElement(R.a,{to:"/not-found"}))))))}}]),t}(n.Component),he=Object(R.g)(ue),de=(a(112),function(e){function t(){return Object(o.a)(this,t),Object(c.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return s.a.createElement("div",null,s.a.createElement(d.a,null,s.a.createElement(he,null)))}}]),t}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(de,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},44:function(e,t,a){e.exports=a(113)},49:function(e,t,a){},86:function(e,t,a){},87:function(e,t,a){},93:function(e,t,a){},94:function(e,t,a){}},[[44,1,2]]]);
//# sourceMappingURL=main.e9a1ef3e.chunk.js.map