function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (name, bullets, score) {
buf.push("<div class=\"scoreboard\"><h3 id=\"playername\">" + (jade.escape(null == (jade_interp = name) ? "" : jade_interp)) + "<p class=\"shotsleft\">Shots:<span id=\"shotsleft\">" + (jade.escape(null == (jade_interp = bullets) ? "" : jade_interp)) + "</span></p><p class=\"score\">Score:<span id=\"score\">" + (jade.escape(null == (jade_interp = score) ? "" : jade_interp)) + "</span></p><p class=\"level\"></p><audio id=\"fired\" src=\"shot.mp3\"></audio><audio id=\"reload\" src=\"reload.mp3\"></audio><audio id=\"empty\" srec=\"empty.mp3\"></audio></h3></div>");}("name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"bullets" in locals_for_with?locals_for_with.bullets:typeof bullets!=="undefined"?bullets:undefined,"score" in locals_for_with?locals_for_with.score:typeof score!=="undefined"?score:undefined));;return buf.join("");
}