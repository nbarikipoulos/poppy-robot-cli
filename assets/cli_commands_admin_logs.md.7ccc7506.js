import{_ as a,c as e,o as s,a as t}from"./app.939acfc6.js";const y=JSON.parse('{"title":"Logs Command","description":"","frontmatter":{"title":"Logs Command"},"headers":[{"level":2,"title":"Overview","slug":"overview"},{"level":2,"title":"Options","slug":"options"},{"level":2,"title":"Examples","slug":"examples"}],"relativePath":"cli/commands/admin/logs.md"}'),o={name:"cli/commands/admin/logs.md"},l=t(`<h1 id="logs" tabindex="-1">Logs <a class="header-anchor" href="#logs" aria-hidden="true">#</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-hidden="true">#</a></h2><p>This command will display logs of the robot to the console.</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">poppy logs </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-h</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-H hostname</span><span style="color:#89DDFF;">]</span></span>
<span class="line"></span></code></pre></div><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-hidden="true">#</a></h2><table><thead><tr><th>\xA0</th><th>desccription</th><th>value</th><th>default</th><th>mandatory</th></tr></thead><tbody><tr><td>-H/--host</td><td>Set the Poppy hostname/IP</td><td>string</td><td>poppy.local</td><td>no</td></tr><tr><td>-h/--help</td><td>Display help about this command</td><td>boolean</td><td>false</td><td>no</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-hidden="true">#</a></h2><p>Get logs of the robot located at poppy1.local</p><div class="language-shell"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">poppy logs -H poppy1.local</span></span>
<span class="line"></span></code></pre></div>`,9),n=[l];function p(d,r,c,i,h,m){return s(),e("div",null,n)}var g=a(o,[["render",p]]);export{y as __pageData,g as default};
