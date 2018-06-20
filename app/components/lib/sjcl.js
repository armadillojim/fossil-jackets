"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.o(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.o(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return!1;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},o:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},u:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>8>>>8>>>8),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.base64={l:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,g=sjcl.codec.base64.l,h=0,f=sjcl.bitArray.bitLength(a);c&&(g=g.substr(0,62)+"-_");for(c=0;6*d.length<f;)d+=g.charAt((h^a[c]>>>e)>>>26),6>e?(h=a[c]<<6-e,e+=26,c++):(h<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,g=sjcl.codec.base64.l,h=0,f;b&&(g=g.substr(0,62)+"-_");for(d=0;d<a.length;d++){f=g.indexOf(a.charAt(d));
if(0>f)throw new sjcl.exception.invalid("this isn't base64!");26<e?(e-=26,c.push(h^f>>>e),h=f<<32-e):(e+=6,h^=f<<32-e)}e&56&&c.push(sjcl.bitArray.partial(e&56,h,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};
sjcl.codec.bytes={fromBits:function(a){var b=[],c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b.push(e>>>24),e<<=8;return b},toBits:function(a){var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a[c],3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};sjcl.hash.sha256=function(a){this.h[0]||r(this);a?(this.c=a.c.slice(0),this.b=a.b.slice(0),this.a=a.a):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.c=this.i.slice(0);this.b=[];this.a=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.b=sjcl.bitArray.concat(this.b,a);b=this.a;a=this.a=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&0x1ff);b<=a;b+=512)this.f(d.subarray(16*e,
16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&0x1ff);b<=a;b+=512)this.f(c.splice(0,16));return this},finalize:function(){var a,b=this.b,c=this.c,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.a/0x100000000));for(b.push(this.a|0);b.length;)this.f(b.splice(0,16));this.reset();return c},i:[],h:[],f:function(a){var b,c,d,e=this.c,g=this.h,h=e[0],f=e[1],k=e[2],n=e[3],l=e[4],p=e[5],m=e[6],q=e[7];for(b=0;64>b;b++)16>b?c=a[b]:(c=a[b+
1&15],d=a[b+14&15],c=a[b&15]=(c>>>7^c>>>18^c>>>3^c<<25^c<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+a[b&15]+a[b+9&15]|0),c=c+q+(l>>>6^l>>>11^l>>>25^l<<26^l<<21^l<<7)+(m^l&(p^m))+g[b],q=m,m=p,p=l,l=n+c|0,n=k,k=f,f=h,h=c+(f&k^n&(f^k))+(f>>>2^f>>>13^f>>>22^f<<30^f<<19^f<<10)|0;e[0]=e[0]+h|0;e[1]=e[1]+f|0;e[2]=e[2]+k|0;e[3]=e[3]+n|0;e[4]=e[4]+l|0;e[5]=e[5]+p|0;e[6]=e[6]+m|0;e[7]=e[7]+q|0}};
function r(a){function b(a){return 0x100000000*(a-Math.floor(a))|0}for(var c=0,d=2,e,g;64>c;d++){g=!0;for(e=2;e*e<=d;e++)if(0===d%e){g=!1;break}g&&(8>c&&(a.i[c]=b(Math.pow(d,.5))),a.h[c]=b(Math.pow(d,1/3)),c++)}}sjcl.hash.sha1=function(a){a?(this.c=a.c.slice(0),this.b=a.b.slice(0),this.a=a.a):this.reset()};sjcl.hash.sha1.hash=function(a){return(new sjcl.hash.sha1).update(a).finalize()};
sjcl.hash.sha1.prototype={blockSize:512,reset:function(){this.c=this.i.slice(0);this.b=[];this.a=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.b=sjcl.bitArray.concat(this.b,a);b=this.a;a=this.a=b+sjcl.bitArray.bitLength(a);if(0x1fffffffffffff<a)throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=this.blockSize+b-(this.blockSize+b&this.blockSize-1);b<=
a;b+=this.blockSize)this.f(d.subarray(16*e,16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=this.blockSize+b-(this.blockSize+b&this.blockSize-1);b<=a;b+=this.blockSize)this.f(c.splice(0,16));return this},finalize:function(){var a,b=this.b,c=this.c,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.a/0x100000000));for(b.push(this.a|0);b.length;)this.f(b.splice(0,16));this.reset();return c},i:[1732584193,4023233417,2562383102,271733878,3285377520],
h:[1518500249,1859775393,2400959708,3395469782],f:function(a){var b,c,d,e,g,h,f=this.c,k;if("undefined"!==typeof Uint32Array)for(k=Array(80),c=0;16>c;c++)k[c]=a[c];else k=a;c=f[0];d=f[1];e=f[2];g=f[3];h=f[4];for(a=0;79>=a;a++)16<=a&&(b=k[a-3]^k[a-8]^k[a-14]^k[a-16],k[a]=b<<1|b>>>31),b=19>=a?d&e|~d&g:39>=a?d^e^g:59>=a?d&e|d&g|e&g:79>=a?d^e^g:void 0,b=(c<<5|c>>>27)+b+h+k[a]+this.h[Math.floor(a/20)]|0,h=g,g=e,e=d<<30|d>>>2,d=c,c=b;f[0]=f[0]+c|0;f[1]=f[1]+d|0;f[2]=f[2]+e|0;f[3]=f[3]+g|0;f[4]=f[4]+h|0}};
sjcl.misc.hmac=function(a,b){this.m=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.g=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.g[0].update(c[0]);this.g[1].update(c[1]);this.j=new b(this.g[0])};sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){if(this.s)throw new sjcl.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};
sjcl.misc.hmac.prototype.reset=function(){this.j=new this.m(this.g[0]);this.s=!1};sjcl.misc.hmac.prototype.update=function(a){this.s=!0;this.j.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.j.finalize(),a=(new this.m(this.g[1])).update(a).finalize();this.reset();return a};"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});
