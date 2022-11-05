import{_ as s,c as n,o as a,a as l}from"./app.1c303544.js";const h=JSON.parse('{"title":"Config Command","description":"","frontmatter":{"title":"Config Command"},"headers":[{"level":2,"title":"Overview","slug":"overview","link":"#overview","children":[]},{"level":2,"title":"Options","slug":"options","link":"#options","children":[]},{"level":2,"title":"Examples","slug":"examples","link":"#examples","children":[]}],"relativePath":"cli/commands/config.md"}'),p={name:"cli/commands/config.md"},e=l(`<h1 id="config" tabindex="-1">Config <a class="header-anchor" href="#config" aria-hidden="true">#</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-hidden="true">#</a></h2><p>This command allows to:</p><ul><li>Check the connection settings to the robots,</li><li>Display the robot structure (<em>i.e.</em> aliases and motors) and then perform a connection test to all motors.</li></ul><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">poppy config </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-MDsh</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-H hostname</span><span style="color:#89DDFF;">]</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#A6ACCD;">-P port</span><span style="color:#89DDFF;">]</span></span>
<span class="line"></span></code></pre></div><h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-hidden="true">#</a></h2><table><thead><tr><th>\xA0</th><th>desccription</th><th>value</th><th>default</th><th>mandatory</th></tr></thead><tbody><tr><td>-M/--structure</td><td>Display the robot structure (aliases and motors) and check connection to each motors</td><td>boolean</td><td>false</td><td>no</td></tr><tr><td>-D/--details</td><td>Display details about motors</td><td>boolean</td><td>false</td><td>no</td></tr><tr><td>-s/--save</td><td>Save connection settings in .poppyrc file</td><td>boolean</td><td>false</td><td>no</td></tr><tr><td>-H/--host</td><td>Set the Poppy hostname/IP</td><td>string</td><td>poppy.local</td><td>no</td></tr><tr><td>-p/--port</td><td>Set the REST API port on Poppy</td><td>integer</td><td>8080</td><td>no</td></tr><tr><td>-h/--help</td><td>Display help about this command</td><td>boolean</td><td>false</td><td>no</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-hidden="true">#</a></h2><ul><li>Typing</li></ul><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">poppy config -M</span></span>
<span class="line"></span></code></pre></div><p>Will discover the robot and display an aliases/motors tree as shown on the screenshot below:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">&gt;&gt; Connection to Poppy (hostname/ip: poppy.local)</span></span>
<span class="line"><span style="color:#A6ACCD;">  REST API (port 8080):  OK</span></span>
<span class="line"><span style="color:#A6ACCD;">&gt;&gt; Structure:</span></span>
<span class="line"><span style="color:#A6ACCD;">  Poppy</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u251C\u2500 base</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u251C\u2500 m1</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u251C\u2500 m2</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2514\u2500 m3</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2514\u2500 tip</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u251C\u2500 m4</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u251C\u2500 m5</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2514\u2500 m6</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>Typing</li></ul><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">poppy config -MD</span></span>
<span class="line"></span></code></pre></div><p>Will display information about motors.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">&gt;&gt; Connection to Poppy (hostname/ip: poppy.local)</span></span>
<span class="line"><span style="color:#A6ACCD;">  REST API (port 8080):  OK</span></span>
<span class="line"><span style="color:#A6ACCD;">&gt;&gt; Structure: </span></span>
<span class="line"><span style="color:#A6ACCD;">  Poppy</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u251C\u2500 base</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u251C\u2500 m1</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2502  \u251C\u2500 id: 1</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2502  \u251C\u2500 type: XL-320</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2502  \u2514\u2500 angle: [-90,90]</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u251C\u2500 m2</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2502  \u251C\u2500 id: 2</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2502  \u251C\u2500 type: XL-320</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2502  \u2514\u2500 angle: [90,-125]</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502  \u2514\u2500 m3</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502     \u251C\u2500 id: 3</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502     \u251C\u2500 type: XL-320</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2502     \u2514\u2500 angle: [90,-90]</span></span>
<span class="line"><span style="color:#A6ACCD;">   \u2514\u2500 tip</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u251C\u2500 m4</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2502  \u251C\u2500 id: 4</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2502  \u251C\u2500 type: XL-320</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2502  \u2514\u2500 angle: [-90,90]</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u251C\u2500 m5</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2502  \u251C\u2500 id: 5</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2502  \u251C\u2500 type: XL-320</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2502  \u2514\u2500 angle: [90,-90]</span></span>
<span class="line"><span style="color:#A6ACCD;">      \u2514\u2500 m6</span></span>
<span class="line"><span style="color:#A6ACCD;">         \u251C\u2500 id: 6</span></span>
<span class="line"><span style="color:#A6ACCD;">         \u251C\u2500 type: XL-320</span></span>
<span class="line"><span style="color:#A6ACCD;">         \u2514\u2500 angle: [90,-90]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>Typing</li></ul><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">poppy config -s -H poppy1.local -p 8081</span></span>
<span class="line"></span></code></pre></div><p>Will check robot located at &#39;poppy1.local&#39; and with REST API configured on port 8081 and save, in case of success, these connection settings in file named .poppyrc.</p>`,19),t=[e];function o(c,i,r,d,C,A){return a(),n("div",null,t)}const D=s(p,[["render",o]]);export{h as __pageData,D as default};
