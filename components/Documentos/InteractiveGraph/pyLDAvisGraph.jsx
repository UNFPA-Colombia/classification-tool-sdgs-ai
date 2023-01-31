export default function pyLDAvisDraw(data) {
  const html = `
  <!DOCTYPE html>
    <html>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/bmabey/pyLDAvis@3.3.1/pyLDAvis/js/ldavis.v1.0.0.css">
  
  
  <div id="ldavis_el1484814481445582725541013699"></div>
  <script type="text/javascript">
  
  var ldavis_el1484814481445582725541013699_data = `+data+`  
  function LDAvis_load_lib(url, callback){
    var s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.onreadystatechange = s.onload = callback;
    s.onerror = function(){console.warn("failed to load library " + url);};
    document.getElementsByTagName("head")[0].appendChild(s);
  }
  
  if(typeof(LDAvis) !== "undefined"){
     // already loaded: just create the visualization
     !function(LDAvis){
         new LDAvis("#" + "ldavis_el1484814481445582725541013699", ldavis_el1484814481445582725541013699_data);
     }(LDAvis);
  }else if(typeof define === "function" && define.amd){
     // require.js is available: use it to load d3/LDAvis
     require.config({paths: {d3: "https://d3js.org/d3.v5"}});
     require(["d3"], function(d3){
        window.d3 = d3;
        LDAvis_load_lib("https://cdn.jsdelivr.net/gh/bmabey/pyLDAvis@3.3.1/pyLDAvis/js/ldavis.v3.0.0.js", function(){
          new LDAvis("#" + "ldavis_el1484814481445582725541013699", ldavis_el1484814481445582725541013699_data);
        });
      });
  }else{
      // require.js not available: dynamically load d3 & LDAvis
      LDAvis_load_lib("https://d3js.org/d3.v5.js", function(){
           LDAvis_load_lib("https://cdn.jsdelivr.net/gh/bmabey/pyLDAvis@3.3.1/pyLDAvis/js/ldavis.v3.0.0.js", function(){
                   new LDAvis("#" + "ldavis_el1484814481445582725541013699", ldavis_el1484814481445582725541013699_data);
              })
           });
  }
  </script>
  </html>
  `
  return html
}


