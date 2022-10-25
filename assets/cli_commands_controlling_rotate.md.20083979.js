import{_ as t,c as e,o as a,a as s}from"./app.96771aa4.js";const D=JSON.parse('{"title":"Rotate Command","description":"","frontmatter":{"title":"Rotate Command"},"headers":[{"level":2,"title":"Overview","slug":"overview","link":"#overview","children":[]},{"level":2,"title":"Options","slug":"options","link":"#options","children":[]},{"level":2,"title":"Examples","slug":"examples","link":"#examples","children":[]}],"relativePath":"cli/commands/controlling/rotate.md"}'),o={name:"cli/commands/controlling/rotate.md"},n=s(`<h1 id="rotate" tabindex="-1">Rotate <a class="header-anchor" href="#rotate" aria-hidden="true">#</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-hidden="true">#</a></h2><p>This command rotates the target motor(s) by x degrees from their current angle.</p><div class="language-shell"><button class="copy"></button><span class="lang">shell</span><pre><code><span class="line"><span style="color:#A6ACCD;">poppy rotate </span><span style="color:#89DDFF;">&lt;</span><span style="color:#A6ACCD;">value</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-wh</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-d duration</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-m motors</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-H hostname</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-P port</span><span style="color:#89DDFF;">]</span></span>
<span class="line"></span></code></pre></div><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-hidden="true">#</a></h2><table><thead><tr><th>\xA0</th><th>desccription</th><th>value</th><th>default</th><th>mandatory</th></tr></thead><tbody><tr><td>&lt;value&gt;</td><td>Rotation value (in degree)</td><td>integer</td><td>n.a.</td><td>yes</td></tr><tr><td>-d/--duration</td><td>Set duration of the movement</td><td>number</td><td>n.a.</td><td>no</td></tr><tr><td>-w/--wait</td><td>Wait until the end of the rotation</td><td>boolean</td><td>false</td><td>no</td></tr><tr><td>-m/--motor</td><td>Select the targeted motors.</td><td>name of motors | &#39;all&#39;</td><td>&#39;all&#39;</td><td>no</td></tr><tr><td>-H/--host</td><td>Set the Poppy hostname/IP</td><td>string</td><td>poppy.local</td><td>no</td></tr><tr><td>-p/--port</td><td>Set the REST API port on Poppy</td><td>integer</td><td>8080</td><td>no</td></tr><tr><td>-h/--help</td><td>Display help about this command</td><td>boolean</td><td>false</td><td>no</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-hidden="true">#</a></h2><ul><li>Simultaneously rotate all motors by 10 degrees:</li></ul><div class="language-shell"><button class="copy"></button><span class="lang">shell</span><pre><code><span class="line"><span style="color:#A6ACCD;">poppy rotate 10</span></span>
<span class="line"></span></code></pre></div><ul><li>Rotate the motor m1 by -90 degrees in 2.5 seconds:</li></ul><div class="language-shell"><button class="copy"></button><span class="lang">shell</span><pre><code><span class="line"><span style="color:#A6ACCD;">poppy rotate -90 -m m1 -d 2.5</span></span>
<span class="line"></span></code></pre></div>`,11),l=[n];function d(r,p,c,i,h,m){return a(),e("div",null,l)}const u=t(o,[["render",d]]);export{D as __pageData,u as default};
