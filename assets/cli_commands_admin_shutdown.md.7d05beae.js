import{_ as t,c as a,o as e,a as s}from"./app.ea318fab.js";const _=JSON.parse('{"title":"Shutdown Command","description":"","frontmatter":{"title":"Shutdown Command"},"headers":[{"level":2,"title":"Overview","slug":"overview","link":"#overview","children":[]},{"level":2,"title":"Options","slug":"options","link":"#options","children":[]},{"level":2,"title":"Examples","slug":"examples","link":"#examples","children":[]}],"relativePath":"cli/commands/admin/shutdown.md"}'),n={name:"cli/commands/admin/shutdown.md"},o=s(`<h1 id="shutdown" tabindex="-1">Shutdown <a class="header-anchor" href="#shutdown" aria-hidden="true">#</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-hidden="true">#</a></h2><p>This command will turn the Raspberry off.</p><div class="language-shell"><button class="copy"></button><span class="lang">shell</span><pre><code><span class="line"><span style="color:#A6ACCD;">poppy shutdown </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-h</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-H hostname</span><span style="color:#89DDFF;">]</span></span>
<span class="line"></span></code></pre></div><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-hidden="true">#</a></h2><table><thead><tr><th>\xA0</th><th>desccription</th><th>value</th><th>default</th><th>mandatory</th></tr></thead><tbody><tr><td>-H/--host</td><td>Set the Poppy hostname/IP</td><td>string</td><td>poppy.local</td><td>no</td></tr><tr><td>-h/--help</td><td>Display help about this command</td><td>boolean</td><td>false</td><td>no</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-hidden="true">#</a></h2><p>Turn the robot located at poppy1.local off:</p><div class="language-shell"><button class="copy"></button><span class="lang">shell</span><pre><code><span class="line"><span style="color:#A6ACCD;">poppy shutdown -H poppy1.local</span></span>
<span class="line"></span></code></pre></div>`,9),l=[o];function d(p,r,h,i,c,u){return e(),a("div",null,l)}const v=t(n,[["render",d]]);export{_ as __pageData,v as default};
