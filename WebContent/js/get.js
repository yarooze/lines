/**
 * GET parameter management
 * @author Sven Mintel
 */
var HTTP_GET_VARS = new Array();
var strGET        = document.location.search.substr(1,document.location.search.length);
if(strGET!='')
{
    gArr = strGET.split('&');
    for( i=0 ; i<gArr.length ; ++i )
    {
        v='';
        vArr=gArr[i].split('=');
        if(vArr.length>1)
        {
          v=vArr[1];
        }
        HTTP_GET_VARS[unescape(vArr[0])]=unescape(v);
    }
}
 
/**
 * @author Sven Mintel
 * @param   {String} v
 * @returns {Array}
 */
function GET(v)
{
  if(!HTTP_GET_VARS[v])
  {
    return 'undefined';
  }
  return HTTP_GET_VARS[v];
}

/**
 * 
 */
function loadLanguage()
{
  var lang = GET('lang');
  
  document.writeln ('<script src="js/lang/');  
  switch (lang)
  {
    case 'de':      
      document.writeln ('de');
      break;

    default:
      document.writeln ('en');
      break;
  }
  document.writeln ('.js"></script>');
}