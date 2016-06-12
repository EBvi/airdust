var app = Application.currentApplication();
app.includeStandardAdditions = true;

var source = app.doShellScript('curl http://cleanair.seoul.go.kr/air_city.htm?method=measure'),
// var source = app.doShellScript('cat ~/Desktop/test.txt'), // TEST
    html = ( source.match(/<!-- 테이터테이블 -->[\W\w]*<!-- 테이터테이블\/\/ -->/)[0]||'' )
    .split(/<!--.*?-->/).join('')
    .replace(/\t/g, '').replace(/\n/g, '').replace(/\r/g, '')
    .split('    ').join('');

var updated = html.match(/<span class=\"ft_point1\">(.*?)<\/span>/)[1],
    tbody = (html.match(/<tbody>.*<\/tbody>/)[0]||'')
    .split(/ class=\".*?\"/).join('')
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
