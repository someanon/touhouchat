(function(){
  "use strict";

  var fn = {}
    , render_order = ""
    , roomHash = '';

  function f (str) {
    ([].slice.call(arguments, 1))
      .forEach(function (n, i) {
        str = str.split("$" + i).join(n || "");
      });

    return str;
  }

  function _l (str) {

    return str.slice(-1) === "#" ? "ol" : "ul";
  }

  // block elements need to be inlined for processing since gruff processes based on lines
  // while processing blocks are inlined and returned to multiline before final return statement
  function nlInliner (str, tokenize) {
    var
      NLs = "\n"
    , NLt = "~!salt-NL-salt!~"
    , rNL = new RegExp(NLs, "g")
    , rNT = new RegExp(NLt, "g");

    return tokenize
      // tokenize newlines for blocks with breaks
      ? str.replace(rNL, NLt)
      // de-tokenize newlines for readability
      : str.replace(rNT, NLs);
  }

  function fnLINK () {
    return function (match, $pre, _, $httpLink, $room, $post) {
      if ( !( $httpLink || $room || $post) ) {
        return match;
      } else {
        if($httpLink) {
          return gruff.templates['LINK']
            .replace("$1", $pre || "")
            .replace(/\$2/g, $httpLink.replace('&amp;', '&'))
            .replace(/\$3/g, $httpLink);
        } else {
          var link = roomHash, linkStr = '/';
          if( $room ) {
            link = linkStr = $room + '/';
          }
          if( $post ) {
            link += $post;
            if( roomHash === $room+'/' ) {
              linkStr = '/' + $post;
            } else {
              linkStr += $post;
            }
          }
          return gruff.templates['LINKROOMPOST']
            .replace("$1", $pre || "")
            .replace(/\$2/g, '/'+link.replace('&amp;', '&'))
            .replace(/\$3/, linkStr);
        }
      }
    };
  }

  function gruff (str, room) {
    roomHash = '#/' + room + '/';
    str = render_order
      .reduce(function (acc, key) {
        var config = fn[key]
          , replacement;
        replacement = (config.func)
          ? config.func.apply(null, config.replacement)
          : gruff.templates[config.replacement];

        return acc.replace(config.pattern, replacement);
      }, str);

    return nlInliner(str, false);
  }

  gruff.render = function (name, pattern, replacement, func) {
    // TODO: error checking!
    if (arguments.length === 1) {
      return fn[name];
    }

    fn[name] = {
        func: func
      , pattern: pattern
      , replacement: replacement
    };

    return this;
  };

  gruff.set_render_order = function (ord) {
    // as it is written, paragraphs need to be the last of the block elements
    // to prevent wrapping block element child lines in paragraph tags
    ord = ord || "P Q LINK STRONG EM";
    //ord = ord || "BLOCKQUOTE CODE DL LI HR H LINK P LINKRAW ABBR CODELET STRONG EM SUB SUP";
    render_order = ord.split(" ");
  };

  gruff.templates = {
      EM         : '<em>$1</em>'
    , LINKROOMPOST   : '$1<a href="$2">$3</a>'
    , LINK       : '$1<a href="$2" target="_blank">$3</a>'
    , Q          : '<q>$1</q>'
    , P          : '<p>$1</p>'
    , STRONG     : '<strong>$1</strong>'
  };

  gruff.set_render_order();

  gruff
    .render("STRONG",     (/\*{(.+?)}\*/g), "STRONG")
    .render("EM",         (/%{(.+?)}%/g), "EM")
    .render("LINK",       (/(.)?((http[s]?:\/\/[^\s]+?)|(#\/\w*[A-Za-z_]\w*)?\/(\d+\/)?)(?=[\s\n\b<])/g), ["LINK"], fnLINK)
    .render("Q",          (/^<p>(&gt;.+)<\/p>$/gm), "Q")
    .render("P",          (/^([^\n].*)$/gm), "P");

  typeof module === 'undefined'
    ? this.gruff = gruff
    : module.exports = gruff;

}.call(this));
