/**
 * Namespace for the app
 *
 * @type {Object}
 */
var LINES = [];

LINES.alert = function (text) {
  alert(text);
};

LINES.confirm = function (text) {
  return confirm(text);
};

/**
 * GET parameter management
 * @author Sven Mintel
 */
LINES.HTTP_GET_VARS = [];
LINES.strGET        = document.location.search.substr(1,document.location.search.length);
if(LINES.strGET!='')
{
    var gArr = LINES.strGET.split('&');
    for( i=0 ; i<gArr.length ; ++i )
    {
        v='';
        var vArr=gArr[i].split('=');
        if(vArr.length>1)
        {
          v=vArr[1];
        }
        LINES.HTTP_GET_VARS[unescape(vArr[0])]=unescape(v);
    }
}
 
/**
 * @author Sven Mintel
 * @param   {String} v
 * @returns {Array}
 */
LINES.GET = function GET(v)
{
  if(!LINES.HTTP_GET_VARS[v])
  {
    return 'undefined';
  }
  return LINES.HTTP_GET_VARS[v];
};

/**
 * adds <script> tag with the language data 
 */
LINES.loadLanguage = function loadLanguage()
{
  var lang        = LINES.GET('lang');
  var script_tag  = '<script src="';
  var script_file = 'js/lang/';
  switch (lang)
  {
    case 'de':      
      script_file = script_file + 'de';
      break;

    case 'ru':      
      script_file = script_file + 'ru';
      break;
      
    default:
      script_file = script_file + 'en';
      break;
  }
  script_file = script_file + '.js';
  script_tag  = script_tag + script_file + '"></script>';

  //$('#lang').attr('src', script_file);
  document.writeln (script_tag);
  $('#load_lang').remove();
};

/**
 * indexOf fix for IE
 */
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
      for(var i=0; i<this.length; i++){
          if(this[i]==obj){
              return i;
          }
      }
      return -1;
  }
}
