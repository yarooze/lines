/**
 * field settings
 */
//default settings
LINES.field_width      = 9;
LINES.field_width_max  = 30;
LINES.field_height     = 9;
LINES.field_height_max = 30;
LINES.field_array      = []; // -1 - empty, else - color of the ball
LINES.fields_empty     = LINES.field_width * LINES.field_height;
LINES.line_len_min     = 5;           // length of the line for remove
LINES.add_balls        = 3;
LINES.add_balls_min    = 1;
LINES.add_balls_max    = 10;
LINES.force_insert     = true;        // insert 0+ balls or the number
LINES.animate_ball     = true;
LINES.jmp_delay        = 50;
LINES.background_img   = 'http://lorempixel.com/'+$( window ).width()+'/'+$( window ).height()+'/';
LINES.background_img_use = false;
LINES.gamefield_cell_size    = 20;

//game vars
LINES.score            = 0;
LINES.ball_selected    = false;
LINES.bonus_turn       = false;
LINES.queued_colors    = []; //colours for the next balls
LINES.ball_color       = null;

//arrays for search
LINES.open_nodes       = []; //
LINES.closed_nodes     = []; //
LINES.ball_path        = []; // calculated ball path

LINES.session          = {
    startTime: new Date(),
    endTime: null,
    score: 0
};

/**
 * possible ball colors
 */
LINES.possible_colors = ['black',
                        'blue',
                        'green',
                        'yellow',
                        'magenta',
                        'red',
                        'white',
                        'grey',
                        'orange',
                        'smiley',
                        'smiley-confuse',
                        'smiley-cool',
                        'smiley-cry',
                        'smiley-draw',
                        'smiley-eek',
                        'smiley-evil'
                        ];
LINES.default_colors_qty = 7;

/**
 * array with ball colors
 */
LINES.colors = [];

for(var i = 0 ; 
        i < LINES.default_colors_qty ;
        i++ ) 
{
    LINES.colors.push(LINES.possible_colors[i]);
}

// Save stuff
/**
 *
 * @type {
 *  {
 *  isWebStorageSupported: LINES.storage.isSupported,
 *  save: LINES.storage.save,
 *  load: LINES.storage.load,
 *  saveSettings: LINES.storage.saveSettings,
 *  loadSettings: LINES.storage.loadSettings,
 *  resetSettings: LINES.storage.resetSettings,
 *  resetAll: LINES.storage.resetAll
 *  }
 * }
 */
LINES.storage = {
    /**
     *
     * @returns {boolean}
     */
    isWebStorageSupported: function isSupported() {
        return (typeof(Storage) !== "undefined");
    },
    /**
     *
     * @param name
     * @param data
     * @returns {boolean}
     */
    save: function save(name, data) {
        if (!LINES.storage.isWebStorageSupported()) {
            return false;
        }
        data = JSON.stringify(data);
        localStorage.setItem(name, data);
        return true;
    },
    /**
     *
     * @param name
     * @returns {null}
     */
    load: function load(name) {
        if (LINES.storage.isWebStorageSupported()) {
            return JSON.parse(localStorage.getItem(name));
        }
        return null;
    },
    /**
     *
     * @returns {boolean}
     */
    saveSettings: function saveSettings() {
        if (!LINES.storage.isWebStorageSupported()) {
            return false;
        }

        var settings = {
            field_width:  LINES.field_width,
            field_height: LINES.field_height,
            line_len_min: LINES.line_len_min,
            add_balls:    LINES.add_balls,
            force_insert: LINES.force_insert,
            animate_ball: LINES.animate_ball,
            background_img: LINES.background_img,
            background_img_use: LINES.background_img_use,
            colors: LINES.colors,
            gamefield_cell_size: LINES.gamefield_cell_size
        };
        LINES.storage.save('settings', settings);
        LINES.fixGamefieldCellSize();
        return true;
    },
    /**
     *
     * @returns {boolean}
     */
    loadSettings: function loadSettings() {
        if (!LINES.storage.isWebStorageSupported()) {
            return false;
        }
        var settings = LINES.storage.load('settings');
        if (settings !== null) {
            LINES.field_width = settings.field_width;
            LINES.field_height = settings.field_height;
            LINES.line_len_min = settings.line_len_min;
            LINES.add_balls = settings.add_balls;
            LINES.force_insert = settings.force_insert;
            LINES.animate_ball = settings.animate_ball;
            LINES.background_img_use = settings.background_img_use;
            if (settings.background_img !== '') {
                LINES.background_img = settings.background_img;
            }
            if (settings.colors.length > 0) {
                LINES.colors = settings.colors;
            }
            LINES.gamefield_cell_size = settings.gamefield_cell_size;
        }
        return true;
    },
    /**
     *
     * @param no_confirm
     * @returns {boolean}
     */
    resetSettings: function resetSettings(no_confirm) {
        if(!no_confirm && !LINES.confirm(LINES.text_sure))
        {
            return false;
        }
        if (!LINES.storage.isWebStorageSupported()) {
            return false;
        }
        LINES.storage.save('settings', null);
        location.reload();
    },
    /**
     *
     * @returns {boolean}
     */
    resetAll: function resetAll() {
        if (!LINES.storage.isWebStorageSupported()) {
            return false;
        }
        localStorage.clear();
        return true;
    }
};

LINES.storage.loadSettings();
//

/**
 * Save game session
 */
LINES.saveSession = function saveSession() {
    LINES.session.endTime = new Date();
    LINES.session.score = LINES.score;
    var sessions = LINES.storage.load('sessions');
    if (sessions === null) {
        sessions = {};
    }
    var highscores = [];
    var timestamps = Object.keys(sessions);
    while (timestamps.length > 0) {
        var timestamp = timestamps.pop();
        if(sessions[timestamp].score < 1) {
            delete sessions[timestamp];
            continue;
        }
        highscores.push(sessions[timestamp]);
    }

    highscores.sort(function compare(a, b) {
        if (a.score < b.score)
            return 1;
        if (a.score > b.score)
            return -1;
        return 0;
    });

    sessions = {};
    var maxHighscores = 10;
    while (highscores.length > 0 && maxHighscores > 0) {
        var highscore = highscores.shift();
        if (LINES.session.startTime !== highscore.startTime) {
            var time = new Date(highscore.startTime);
            sessions[time.getTime()] = highscore;
        }
        --maxHighscores;
    }
    sessions[LINES.session.startTime.getTime()] = LINES.session;

    LINES.storage.save('sessions', sessions);
}

/**
 * adds another color to the color array
 * @param {String} color_name
 * @returns {bool} 
 */
LINES.colorsAddColor = function colorsAddColor(color_name)
{  
  if(LINES.colors.indexOf(color_name) != -1)
  {
    return false;
  }
    LINES.colors.push(color_name);
  return true;
};

/**
 * removes color from array and reindexes it
 * @param {String} color_name
 * @returns {bool}
 */
LINES.colorsRemoveColor = function colorsRemoveColor(color_name)
{
  if(LINES.colors.length < 2)
  {
      LINES.alert(LINES.text_cannot_remove_last_color);
    return false;  
  }
  
  var index = LINES.colors.indexOf(color_name);
  if(index == -1)
  {
    return false;
  }
    LINES.colors.splice(index, 1);
  return true;
};

/**
 * returns random color index
 * @returns {number}
 */
LINES.getRandomColor = function getRandomColor()
{
    var random = Math.floor(Math.random() * LINES.colors.length);
    return random;
};

/**
 * returns the name of the color by index
 * @param   {number} color_index
 * @returns {String}
 */
LINES.getColorName = function getColorName(color_index)
{
    //for debug mode, to find out, what's happening
    if(LINES.colors[color_index] == undefined)
    {
        LINES.alert(LINES.text_error_color_index_part_1 +
                color_index +
            LINES.text_error_color_index_part_2);
      return LINES.colors[1];
    }
    return LINES.colors[color_index];
};

/**
 * gets the first colour from the queued_colors and fills the queue again
 * @returns {number}
 */
LINES.getQueuedColor = function getQueuedColor()
{
  //remove spare balls if queue is to long
  while(LINES.queued_colors.length > LINES.add_balls)
  {
      LINES.queued_colors.pop();
  }  
    //fill colours
    if(LINES.queued_colors.length < LINES.add_balls)
    {
        for(var i = LINES.add_balls - LINES.queued_colors.length ;
            i > 0 ;
            i--)
        {
            LINES.queued_colors.push(LINES.getRandomColor());
            //console.log(i);
        }
    }
    LINES.queued_colors.push(LINES.getRandomColor());
    return LINES.queued_colors.shift();
};

/**
 * gets x and y as integers from the id
 * @param string id
 * @returns array((int)y, (int)x)
 */
LINES.getCoordsFromId = function getCoordsFromId(elem_id)
{
    var delimiter_pos = elem_id.indexOf('_');
    var elem_y        = parseInt(elem_id.substring(0, delimiter_pos), 10);
    var elem_x        = parseInt(elem_id.substring(delimiter_pos + 1), 10);
    var coords        = [elem_y, elem_x];
    return coords;
};


/**
 * redraws field and restarts game
 * @param   {Boolean} no_confirm 
 * @returns {Boolean}
 */
LINES.restartGame = function restartGame(no_confirm)
{
    if(!no_confirm && !LINES.confirm(LINES.text_sure))
    {
        return false;
    }
    LINES.storage.saveSettings();
    LINES.pausecomp(20);

    LINES.fields_empty  = LINES.field_width * LINES.field_height;
    LINES.score         = 0;
    LINES.ball_selected = false;
    LINES.bonus_turn    = false;
    LINES.queued_colors = [];

    LINES.drawGameboard(LINES.field_height, LINES.field_width, 'place_for_board');
    LINES.fixGamefieldCellSize();
    LINES.initGame();
    return false;
};

/**
 * draws table rows and cols
 * @param {number} rows
 * @param {number} cols
 * @param {String} elem_id
 */
LINES.drawGameboard = function drawGameboard(rows, cols, elem_id)
{
    var output_table = '<table class="board">';
    for (var i_row = 0 ; i_row < rows ; i_row++)
    {
        LINES.field_array[i_row] = [];
        output_table       = output_table + '<tr>';
        for (var i_col = 0 ; i_col < cols ; i_col++)
        {
            LINES.field_array[i_row][i_col]  = -1;
            output_table               = output_table +
            '<td><a href="javascript:;">'+
            '<div class="cell" id="'+i_row+'_'+i_col+'">'+
            '</div></a></td>';
        }
        output_table = output_table + '</tr>';
    }
    output_table = output_table + '</table>';
    if(elem_id)
    {
        $('#'+elem_id).html(output_table);
        return;
    }
    document.write(output_table);
    LINES.fixGamefieldCellSize();
};

/**
 *
 */
LINES.fixGamefieldCellSize = function fixGamefieldCellSize () {
    $('div.cell').css("width", LINES.gamefield_cell_size+"px");
    $('div.cell').css("height", LINES.gamefield_cell_size+"px");
    var ball_size = LINES.gamefield_cell_size-4;
    $('div.cell').css("background-size", ball_size+"px "+ball_size+"px");
    $('#place_for_board_wrapper').css("width", LINES.gamefield_cell_size * (LINES.field_width + 5));
    $('.pedestal').css("width", LINES.gamefield_cell_size);
    $('#place_for_board_wrapper').css("height", LINES.gamefield_cell_size * (LINES.field_width + 2));
    $('.pedestal_area').css("min-height", LINES.gamefield_cell_size * (LINES.field_width + 2));
}

/**
 * Prints use colors part of the settings menu
 */
LINES.drawMenuUseColorsPart = function drawMenuUseColorsPart() {
    for(var i = 0; i < LINES.possible_colors.length; i++) {
        var color_name = LINES.possible_colors[i];
        document.write('<tr><td>'+
            '<div class="cell ball b-'+color_name+'" '+
            'style="float:right;">'+
            '</div></td>'+
            '<td id="settings_color_'+color_name+'">'+
            '<input type="checkbox" '+
            'value="'+color_name+'" '+
            'name="settings_color_'+color_name+'" />'+
            '</td></tr>');

        $('#settings_color_'+color_name+' input')
            .attr('checked', (LINES.colors.indexOf(color_name) > -1))
            .change(
                function() {
                    var color   = this.value;
                    var checked = this.checked;
                    var ok      = true;
                    if(checked) {
                        ok = LINES.colorsAddColor(color);
                    } else {
                        ok = LINES.colorsRemoveColor(color)
                    }
                    if(!ok) {
                        this.checked != (checked);
                        return;
                    }
                    LINES.restartGame(true);
                });
    }
}

/**
 * puts ball to field
 * @param string elem_id
 * @param int ball_color
 */
LINES.putBall = function putBall (elem_id, ball_color)
{
    LINES.drawBall(elem_id, ball_color);
    LINES.ballHasLine(elem_id, ball_color);
    LINES.updateGui();
};

LINES.drawBall = function drawBall(elem_id, ball_color)
{
    if(ball_color == null)
    {
        //ball_color = LINES.ball_color;
        ball_color = LINES.getQueuedColor();
        //ball_color = getRandomColor();
    }
    $('#'+elem_id).addClass('ball');
    $('#'+elem_id).addClass('b-'+LINES.getColorName(ball_color));
    var coords = LINES.getCoordsFromId(elem_id);
    LINES.field_array[coords[0]][coords[1]] = ball_color;
    LINES.balls_added++;
    LINES.fields_empty--;
};

/**
 * removes ball from field
 * @param elem_id
 */
LINES.removeBall = function removeBall (elem_id)
{
    $('#'+elem_id).removeClass();
    $('#'+elem_id).addClass('cell');

    var coords = LINES.getCoordsFromId(elem_id);
    LINES.field_array[coords[0]][coords[1]] = -1;
    LINES.fields_empty++;
    LINES.updateGui();
};

/**
 * randomly adds balls to field
 * @param   int balls_qty
 * @returns int balls_added
 */
LINES.addBallsToField = function addBallsToField(balls_qty)
{
    LINES.balls_added = 0;
    if(LINES.fields_empty < 1)
    {
        LINES.alert(LINES.text_no_more_fields);
        return LINES.balls_added;
    }
    for(var balls = balls_qty ; balls > 0 ; balls--)
    {
        var random_y = Math.floor(Math.random() * LINES.field_height);
        var random_x = Math.floor(Math.random() * LINES.field_width);
        var field_id = '';

        LINES.ball_color = LINES.getQueuedColor();

        //try the fast method first
        if(LINES.isWalkable(random_x, random_y)) // field_array[random_y][random_x] < 0)
        {
            LINES.putBall(random_y+'_'+random_x, LINES.ball_color);
        }
        else if(LINES.force_insert && // hard mode
                (field_id = LINES.getRandomFreeField()))
        {
          //put ball to random free field
            LINES.putBall(field_id, LINES.ball_color);
        }

        //game over
        if(LINES.fields_empty < 1)
        {
            LINES.alert(LINES.text_no_more_fields);
          return LINES.balls_added;
        }
    }
    return LINES.balls_added;
};

/**
 * returns array with free fields
 * @returns {Array}
 */
LINES.findFreeFields = function findFreeFields()
{
  var empty_fields = [];
  //loop through fields, test if free
  for(var y = 0 ; y < LINES.field_width ; y++)
  {
    for(var x = 0 ; x < LINES.field_height ; x++)
    {
      if(LINES.isWalkable(x, y))
      {
        empty_fields.push(y+'_'+x);
      }      
    }
  }  
  return empty_fields;
};

/**
 * returns id of the free field or null
 * @returns {mixed}
 */
LINES.getRandomFreeField = function getRandomFreeField()
{
  var free_feilds = LINES.findFreeFields();
  if(free_feilds.length < 1)
  {
    return false;    
  }    
  return free_feilds[Math.floor(Math.random() * free_feilds.length)];
};

/**
 * tests if this ball builds a line
 * @param   string ball_id
 * @param   int    ball_color
 * @returns false or array with ids 
 */
LINES.ballHasLine = function ballHasLine(ball_id, ball_color)
{
    var line          = false;
    var line_len      = 0;
    var coords        = LINES.getCoordsFromId(ball_id);
    var elem_y        = coords[0];
    var elem_x        = coords[1];
    if(ball_color == null)
    {
        //ball_color = LINES.ball_color;
        ball_color = LINES.getQueuedColor();
        //ball_color = getRandomColor();
    }

    //find lines
    var line_n  = LINES.doLine(elem_x, elem_y,  0, -1, ball_color, false);
    var line_no = LINES.doLine(elem_x, elem_y,  1, -1, ball_color, false);
    var line_o  = LINES.doLine(elem_x, elem_y,  1,  0, ball_color, false);
    var line_os = LINES.doLine(elem_x, elem_y,  1,  1, ball_color, false);
    var line_s  = LINES.doLine(elem_x, elem_y,  0,  1, ball_color, false);
    var line_sw = LINES.doLine(elem_x, elem_y, -1,  1, ball_color, false);
    var line_w  = LINES.doLine(elem_x, elem_y, -1,  0, ball_color, false);
    var line_nw = LINES.doLine(elem_x, elem_y, -1, -1, ball_color, false);

    var line_hor       = line_o + line_w;
    //console.log('hor: '+line_hor);
    var line_ver       = line_n + line_s;
    //console.log('ver: '+line_ver);
    var line_slash     = line_sw + line_no;
    //console.log('slash: '+line_slash);
    var line_backslash = line_os + line_nw;
    //console.log('backslash: '+line_backslash);

    //delete lines
    if(line_hor >= LINES.line_len_min-1)
    {
        //alert('line_hor ' + line_hor +' '+ line_len);
      line_len   += line_hor;
         line_o  = LINES.doLine(elem_x, elem_y,  1,  0, ball_color, true);
         line_w  = LINES.doLine(elem_x, elem_y, -1,  0, ball_color, true);
        line = true;
    }
    if(line_ver >= LINES.line_len_min-1)
    {
        //alert('line_ver ' + line_ver +' '+ line_len);
      line_len   += line_ver;
         line_n  = LINES.doLine(elem_x, elem_y,  0, -1, ball_color, true);
         line_s  = LINES.doLine(elem_x, elem_y,  0,  1, ball_color, true);
        line = true;
    }
    if(line_slash >= LINES.line_len_min-1)
    {
        //alert('line_slash ' + line_slash +' '+ line_len);
      line_len   += line_slash;
         line_no = LINES.doLine(elem_x, elem_y,  1, -1, ball_color, true);
         line_sw = LINES.doLine(elem_x, elem_y, -1,  1, ball_color, true);
        line = true;
    }
    if(line_backslash >= LINES.line_len_min-1)
    {
        //alert('line_backslash ' + line_backslash +' '+ line_len);
      line_len   += line_backslash;
        line_os = LINES.doLine(elem_x, elem_y,  1,  1, ball_color, true);
        line_nw = LINES.doLine(elem_x, elem_y, -1, -1, ball_color, true);
        line = true;
    }

    if(line)
    {
        LINES.removeBallInLine(elem_x, elem_y);
        ++line_len;
    }

    //console.log(line_len);
    LINES.updateGui();
    LINES.doBonusPoints(line_len);
    return line;
};

/**
 * calculates bonus points and adds them to score
 * @param {number} balls
 */
LINES.doBonusPoints = function doBonusPoints(balls)
{
  //if balls > line_len_min                  -> double score
  //if balls >= (field_width+field_height)/2  -> x10
  if(balls >= ((LINES.field_width+LINES.field_height)/2))
  {
      LINES.score = LINES.score + balls * 9; // one will be added in addScore
    //$('#score').html(score+' (x10)');
      LINES.alert(balls + ' x10');
  }
  else if(balls > LINES.line_len_min)
  {
      LINES.score = LINES.score + balls;
    //$('#score').html(score+' (x2)');
      LINES.alert(balls + ' x2');
  }
  var highScoreMax = LINES.storage.load('highscore_max');
  if (highScoreMax < LINES.score) {
      LINES.storage.save('highscore_max', LINES.score);
  }
};

/**
 * searches for the balls with defined color
 * returns the length of the found line and 
 * removes it, if erase == true
 * @param cur_x     int 
 * @param cur_y     int 
 * @param inc_x     int 
 * @param inc_y     int 
 * @param color     int
 * @param erase     bool
 * @returns {Number}
 */
LINES.doLine = function doLine(cur_x, cur_y, inc_x, inc_y, color, erase)
{
    var found = 0;
    var new_x = cur_x + inc_x;
    var new_y = cur_y + inc_y;

    if(!LINES.fieldExists(new_x, new_y))
    {
        return found;
    }

    if(LINES.field_array[new_y][new_x] == color) //right color on new position?
    {
        //console.log(colors[color] + ': ' + new_x + ' - ' + new_y + ' ('+found+')');
        found++;
        if(erase == true)
        {
            LINES.removeBallInLine(new_x, new_y);
            LINES.bonus_turn = true;
        }
        found = found + LINES.doLine(new_x, new_y, inc_x, inc_y, color, erase);
    }
    //console.log(found);
    return found;
};

/**
 * selects field
 * @param x
 * @param y
 */
LINES.selectField = function selectField(x, y)
{
    var elem_id = '';
    elem_id     = y + '_' + x;
    //alert('('+elem_id+')');
    $('#'+elem_id).addClass('selected');
};

/**
 * removes field's selection
 * @param x
 * @param y
 */
LINES.deselectField = function deselectField(x, y)
{
    var elem_id = y + '_' + x;
    $('#'+elem_id).removeClass('selected');
};

/**
 * removes balls for the line
 * also adds score and does stuff
 * @param new_x
 * @param new_y
 */
LINES.removeBallInLine = function removeBallInLine(new_x, new_y)
{
    LINES.selectField(new_x, new_y);
    LINES.removeBall(new_y + '_' + new_x);
    LINES.deselectField(new_x, new_y);
    LINES.addScore();
};

/**
 * adds score and does stuff
 */
LINES.addScore = function addScore(new_score)
{   
    if(new_score == null)
    {
        LINES.score++;
    }
    else
    {
        LINES.score = new_score;
    }
    var highScoreMax = LINES.storage.load('highscore_max');
    if (highScoreMax < LINES.score) {
        LINES.storage.save('highscore_max', LINES.score);
    }
    LINES.updateGui();
};

/**
 * writes vars to GUI
 */
LINES.updateGui = function updateGui()
{
    //LINES.storage.save('highscore_max', 0);
    //$('.score').html(LINES.score);
    var highscoreMax = LINES.storage.load('highscore_max');
    if (highscoreMax > LINES.score) {
        // $('#highscore_max').html('['+highscoreMax+']');
        $('#pedestal_king').css("height", highscoreMax + 'px');
        $('.max_score').html(highscoreMax);
    } else {
        // $('#highscore_max').html('');
    }
    $('#pedestal_you').css("height", LINES.score + 'px');
    $('.your_score').html(LINES.score);

    $('#fields_empty').html(LINES.fields_empty);

    var output = '';
    for(var i = 0;
        i < LINES.queued_colors.length ;
        i++ )
    {
        //<div class="cell ball b-magenta"></div>
        //	$('#'+elem_id).removeClass();
        //$('#'+elem_id).addClass('cell');
        //output = output + queued_colors[i] + ' ';

        output = output +
                    '<span class="cell ball b-'+LINES.getColorName(LINES.queued_colors[i])+
                    '">&nbsp;&nbsp;&nbsp;&nbsp;</span>'

    }
    $('#next_balls').html(output);

    LINES.saveSession();
    var sessions = LINES.storage.load('sessions');
    
    if (sessions !== null) {

    var highscores = [];
    var timestamps = Object.keys(sessions);
    while (timestamps.length > 0) {
        var timestamp = timestamps.pop();
        highscores.push(sessions[timestamp]);
    }

    highscores.sort(function compare(a, b) {
        if (a.score < b.score)
            return 1;
        if (a.score > b.score)
            return -1;
        return 0;
    });

    var table =  $('<table></table>');
    while (highscores.length > 0) {
        var highscore = highscores.shift();
        var startTime = new Date(highscore.startTime);
        var endTime = new Date(highscore.endTime);
        var formattedDate = startTime.toLocaleDateString() + ': '+
                startTime.toLocaleTimeString() + ' - ' + endTime.toLocaleTimeString() + '';
        if (startTime.getTime() == LINES.session.startTime.getTime()) {
            formattedDate  = '<em>' + formattedDate + '</em>';
        }
        var row = $('<tr><th><strong>' + highscore.score + '</strong></th><td>' +
            formattedDate + '</td></tr>');
        table.append(row);
    }

        $('#highscores').html(table);
    }

    //console.log(queued_colors);
};

/**
 * tests if field exist
 * @param x
 * @param y
 * @returns {Boolean}
 */
LINES.fieldExists = function fieldExists(x, y)
{
    if(x < 0 ||
       y < 0 ||
       x+1 > LINES.field_width ||
       y+1 > LINES.field_height)
    {
        return false;
    }
    return true;
};

/**
 * tests if field is free
 * @param x
 * @param y
 * @returns {Boolean}
 */
LINES.isWalkable = function isWalkable(x, y)
{
    if(LINES.fieldExists(x, y))
    {
        return LINES.field_array[y][x] == -1;
    }
    return false;
};

/**
 * select a ball for manipulations
 * @param elem_id
 */
LINES.chooseBall = function chooseBall(elem_id)
{
    var coords = LINES.getCoordsFromId(elem_id);
    if(LINES.ball_selected != false)
  {
        //console.log(ball_selected);
      LINES.deselectField(LINES.ball_selected[1],LINES.ball_selected[0])
  }
    LINES.selectField(coords[1],coords[0]);
    LINES.ball_selected = coords;
};

/**
 * moves ball to another field
 * @param elem_id
 */
LINES.moveSelectedBallTo = function moveSelectedBallTo(elem_id)
{
    var coords = LINES.getCoordsFromId(elem_id);
    LINES.initSearch(LINES.ball_selected[1],LINES.ball_selected[0]);
    //console.log(ball_selected[1] +' - '+ball_selected[0]);
    if(LINES.isNodeInArray(LINES.closed_nodes, elem_id) == false)
    {
        //console.log(closed_nodes);
        //console.log(open_nodes);
        //console.log(elem_id);
        LINES.alert(LINES.text_no_way);
        return;
    }

    LINES.deselectField(LINES.ball_selected[1],LINES.ball_selected[0]);
    LINES.ball_color = LINES.field_array[LINES.ball_selected[0]][LINES.ball_selected[1]];

    // finding the way
    if (LINES.animate_ball) {
    var nodeForPath = LINES.findNodeInArray(LINES.closed_nodes, elem_id);

    //ball_path.unshift([elem_id, coords[1],coords[0], nodeForPath[0]]);
    LINES.ball_path.unshift(nodeForPath);
    while (nodeForPath[3] !== LINES.ball_selected[0]+'_'+LINES.ball_selected[1]) {
        //selectField(nodeForPath[1], nodeForPath[0]);
        nodeForPath = LINES.findNodeInArray(LINES.closed_nodes, nodeForPath[3]);
        LINES.ball_path.unshift(nodeForPath);
    }

    nodeForPath = LINES.findNodeInArray(LINES.closed_nodes, nodeForPath[3]);
    LINES.ball_path.unshift(nodeForPath);

    $('#blockbg').show();
    LINES.ballMove();
    
    } else {
        LINES.ballJmp(LINES.ball_selected[0]+'_'+LINES.ball_selected[1], elem_id);
        LINES.afterMove();
    }  
};

LINES.afterMove = function afterMove()
{
    $('#blockbg').hide();
    LINES.ball_selected = false; //?
    LINES.ball_path = [];
    
  if(LINES.bonus_turn)
  {
      LINES.bonus_turn = false;
    return;
  }

  LINES.addBallsToField(LINES.add_balls);
};

LINES.ballMove = function ballMove()
{
    if(LINES.ball_path.length === 1) {
        var cur_ball = LINES.ball_path.shift();
        LINES.ballHasLine(cur_ball[0], LINES.ball_color);
        LINES.updateGui();
    } else if(LINES.ball_path.length > 1) {
        var cur_ball = LINES.ball_path.shift();
        var next_ball = LINES.ball_path.shift();
        //LINES.ballJmp(cur_ball[0], next_ball[0]);
        LINES.removeBall(cur_ball[0]);
        LINES.drawBall(next_ball[0], LINES.ball_color);
        LINES.ball_path.unshift(next_ball);
        setTimeout(function(){LINES.ballMove();}, LINES.jmp_delay);
        return;
    }
    LINES.afterMove();
};

LINES.ballJmp = function ballJmp(start_id, dest_id)
{
    LINES.removeBall(start_id);
    LINES.putBall(dest_id, LINES.ball_color);
};

/**
 * prepares walkable area for start node
 * @param int x
 * @param int y
 */
LINES.initSearch = function initSearch(x, y)
{
    //clear arrays
    LINES.open_nodes   = [];
    LINES.closed_nodes = [];
    //move start to closed_nodes
    var start_node = [y+'_'+x, x, y];
    LINES.closed_nodes.push(start_node);
    //find it's neighbours
    LINES.findNeighbours(x,y);

    //loop through neighbours, start findNeighbours for them
    //and move them to closed_nodes
    var test = 10;
    while(LINES.open_nodes.length > 0)
    {
        var node = LINES.open_nodes.shift();
        LINES.closed_nodes.push(node);
        LINES.findNeighbours(node[1], node[2]);
        //selectField(node[1], node[2]);
        if(test < 1) //for debug
        {
            //return;
        }
        --test;
    }
};

/**
 * finds all neighbour fields, tests if they are walkable
 * and saves them to open nodes
 * @param   int x
 * @param   int y
 * @returns int neighbours
 */
LINES.findNeighbours = function findNeighbours(x,y)
{
    var tmp             = 0;
    var neighbours_found = 0;
    var node = [];
    //find 4 neighbours and move them to open_nodes
    //if they are walkable
    tmp = x-1;
    if(LINES.isWalkable(tmp, y) &&
        LINES.isNodeInArray(LINES.open_nodes, y+'_'+tmp)   == false &&
        LINES.isNodeInArray(LINES.closed_nodes, y+'_'+tmp) == false)
    {
         node = [y+'_'+tmp, tmp, y, y+'_'+x];
        LINES.open_nodes.push(node);
        ++neighbours_found;
    }

    tmp = x+1;
    if(LINES.isWalkable(tmp, y) &&
        LINES.isNodeInArray(LINES.open_nodes, y+'_'+tmp)   == false &&
        LINES.isNodeInArray(LINES.closed_nodes, y+'_'+tmp) == false)
    {
         node = [y+'_'+tmp, tmp, y, y+'_'+x];
        LINES.open_nodes.push(node);
        ++neighbours_found;
    }

    tmp = y-1;
    if(LINES.isWalkable(x, tmp) &&
        LINES.isNodeInArray(LINES.open_nodes, tmp+'_'+x)   == false &&
        LINES.isNodeInArray(LINES.closed_nodes, tmp+'_'+x) == false)
    {
         node = [tmp+'_'+x, x, tmp, y+'_'+x];
        LINES.open_nodes.push(node);
        ++neighbours_found;
    }

    tmp = y+1;
    if(LINES.isWalkable(x, tmp) &&
        LINES.isNodeInArray(LINES.open_nodes, tmp+'_'+x)   == false &&
        LINES.isNodeInArray(LINES.closed_nodes, tmp+'_'+x) == false)
    {
         node = [tmp+'_'+x, x, tmp, y+'_'+x];
        LINES.open_nodes.push(node);
        ++neighbours_found;
    }
    return neighbours_found;
};

/**
 * tests if node is in array
 * @param array nodes
 * @param string node_id
 * @returns {bool}
 */
LINES.isNodeInArray = function isNodeInArray(nodes, node_id)
{
    if (LINES.findNodeInArray(nodes, node_id) !== null) {
        return true;
    }
    return false;
};

/**
 * tests if node is in array
 * @param array nodes
 * @param string node_id
 * @returns {Object}
 */
LINES.findNodeInArray = function findNodeInArray(nodes, node_id)
{
    //loop through array and return true if node is in array
    for ( var i = 0 ; i < nodes.length ; i++ ) 
    {
        if(nodes[i][0] === node_id)
        {
            return nodes[i];
        }
    }	
    return null;
};

/**
 * makes pause for millis ms
 * @param millis
 * @author www.sean.co.uk
 */
LINES.pausecomp = function pausecomp(millis)
{
  var date = new Date();
  var curDate = null;  
  do 
  { 
    curDate = new Date(); 
  } 
  while(curDate-date < millis);
};
