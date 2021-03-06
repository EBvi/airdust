var app = Application.currentApplication();
app.includeStandardAdditions = true;

var source = app.doShellScript('curl http://cleanair.seoul.go.kr/air_city.htm?method=measure'),
// var source = app.doShellScript('cat ~/Desktop/test.txt'), // TEST
    html = ( source.match(/<div class="sch2 mgb10">[\W\w]*<\/table>/)[0]||'' )
    .split(/<!--.*?-->/).join('')
    .replace(/\t/g, '').replace(/\n/g, '').replace(/\r/g, '')
    .split('    ').join('');

var updated = html.match(/<h4 class=\"mgb10 mgt20\">.*:(.*?)<\/h4>/)[1],
    tbody = (html.match(/<tbody>.*<\/tbody>/)[0]||'')
    .split(/ class=\".*?\"/).join('')
    .split(/ scope=\".*?\"/).join('')
    .split("&nbsp;").join(' ')
    .split(/ style=\".*?\"/).join('');

var items = [];
tbody.match(/<tr>(.*?)<\/tr>/g).map(function(tr){
    var v = tr.match(/<td ?>(.*?)<\/td>/g).map(function(n){
        return n.split(/<\/?\w*>/).join('').trim();
    });
    items.push({
        title: `${v[0]} :: 미세먼지(${v[1]}), 초미세먼지(${v[2]}) - ${v[7]}`,
        subtitle: `${updated} 기준`
    });
});