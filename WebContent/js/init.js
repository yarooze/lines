/**
 * writes text to the page
 */
LINES.updateTextOnThePage  = function updateTextOnThePage()
{
//  $('#text_title').html(text_title);
  $('#text_score').html(LINES.text_score);
  $('#text_empty_fields').html(LINES.text_empty_fields);
  $('#text_next_balls').html(LINES.text_next_balls);
  $('#text_add_balls').val(LINES.text_add_balls);
  $('#text_settings').val(LINES.text_settings);
  $('#text_settings_close').html(LINES.text_settings_close);
  $('#text_reset_settings').val(LINES.text_reset_settings);
  $('#text_restart_game').val(LINES.text_restart_game);
  $('#text_settings_add_balls').html(LINES.text_settings_add_balls);
  $('#text_settings_force_add_balls').html(LINES.text_settings_force_add_balls);
  $('#text_settings_animate_ball').html(LINES.text_settings_animate_ball);
  $('#text_settings_line_len_min').html(LINES.text_settings_line_len_min);
  $('#text_settings_gamefield_cols').html(LINES.text_settings_gamefield_cols);
  $('#text_settings_gamefield_rows').html(LINES.text_settings_gamefield_rows);
  $('#text_use_colors').html(LINES.text_use_colors);
  $('#text_settings_background_img').html(LINES.text_settings_background_img);
  $('#text_settings_gamefield_cell_size').html(LINES.text_settings_gamefield_cell_size);
};

/**
 * init game
 * 
 */
LINES.initGame = function initGame()
{
    LINES.session          = {
        startTime: new Date(),
        endTime: null,
        score: 0
    };
    LINES.saveSession();

    LINES.updateTextOnThePage();
    LINES.getQueuedColor();
    LINES.updateGui();
    LINES.addBallsToField(LINES.add_balls);
	
  $('.cell').click(function() 
      {
        if($(this).hasClass('ball')) 
        {
            LINES.chooseBall($(this).attr('id'));
        }
        else if(LINES.ball_selected)
        {
            LINES.moveSelectedBallTo($(this).attr('id'));
        }
        else
        {
            LINES.alert(LINES.text_please_select_ball);
        }
      });
    $('#blockbg').hide();
};

//call this function for the very first time
$(document).ready(function()
{
  $('.toggle_settings').click(
      function() 
      { 
         $('#settings').toggle(); 
         if ($('#settings').is(':visible')) 
         { 
           $(this).val(LINES.text_settings_hide);
         }
         else 
         { 
           $('.toggle_settings').val(LINES.text_settings);
         }

          LINES.storage.saveSettings();
      }
    );       
  
  $('#settings_add_balls input')
  .attr('value',LINES.add_balls)
  .attr('min',LINES.add_balls_min)
  .attr('max',LINES.add_balls_max)
  .change(
         function()
         {
               var balls = parseInt(this.value, 10);
                 if(balls >= LINES.add_balls_min &&
                    balls <= LINES.add_balls_max )
                 {
                     LINES.add_balls = balls;
                 }
                 else
                 {                                                 
                   this.value = LINES.add_balls;
                     LINES.alert(LINES.error_invalid_value);
                 }
             LINES.storage.saveSettings();
         });

$('#settings_force_add_balls input')
  .attr('checked',LINES.force_insert)
  .change(
         function()
         {
           var force = this.checked;
           if(force == true) 
           {
               LINES.force_insert = true;
           }
           else
           {
               LINES.force_insert = false;
           }
             LINES.storage.saveSettings();
         });

$('#settings_animate_ball input')
    .attr('checked',LINES.animate_ball)
    .change(
        function()
        {
            var animate_ball = this.checked;
            if(animate_ball == true)
            {
                LINES.animate_ball = true;
            }
            else
            {
                LINES.animate_ball = false;
            }
            LINES.storage.saveSettings();
        });

$('#settings_line_len_min input')
  .attr('value',LINES.line_len_min)
  .attr('min',1)
  //.attr('max',10)
  .change(
         function()
         {
               var balls = parseInt(this.value, 10);
                 if(balls >= 1 
                    //&& balls <= 10 
                    ) 
                 {
                     LINES.line_len_min = balls;
                 }
                 else
                 {                                                 
                   this.value = LINES.line_len_min;
                     LINES.alert(LINES.error_invalid_value);
                 }
             LINES.storage.saveSettings();
         });    

$('#settings_gamefield_cols input')
  .attr('value',LINES.field_width)
  .attr('min',1)
  .attr('max',LINES.field_width_max)
  .change(
         function()
         {
               var cols = parseInt(this.value, 10);                                          
                 if(   cols >= 1 
                    && cols <= LINES.field_width_max
                    ) 
                 {
                     LINES.field_width = cols;
                     LINES.restartGame(true);
                 }
                 else
                 {                                                 
                   this.value = LINES.field_width;
                     LINES.alert(LINES.error_invalid_value);
                 }
             LINES.storage.saveSettings();
         });    

$('#settings_gamefield_rows input')
  .attr('value',LINES.field_height)
  .attr('min',1)
  .attr('max',LINES.field_height_max)
  .change(
         function()
         {
               var rows = parseInt(this.value, 10);                                          
                 if(   rows >= 1 
                    && rows <= LINES.field_height_max
                    ) 
                 {
                     LINES.field_height = rows;
                     LINES.restartGame(true);
                 }
                 else
                 {                                                 
                   this.value = LINES.field_height;
                     LINES.alert(LINES.error_invalid_value);
                 }
             LINES.storage.saveSettings();
         });

    $('#settings_background_img input')
        .attr('value', LINES.background_img)
        .change(
            function() {
                LINES.background_img = this.value;
                if (LINES.background_img_use) {
                    $('body').css("background-image", 'url('+LINES.background_img+')');
                }
                LINES.storage.saveSettings();
            });

    $('#settings_background_img_use input')
        .attr('checked',LINES.background_img_use)
        .change(
            function() {
                var background_img_use = this.checked;
                if(background_img_use == true) {
                    LINES.background_img_use = true;
                    $('body').css("background-image", 'url('+LINES.background_img+')');
                } else {
                    LINES.background_img_use = false;
                    $('body').css("background-image", 'none');
                }
                LINES.storage.saveSettings();
            });

    if (LINES.background_img_use) {
        $('body').css("background-image", 'url('+LINES.background_img+')');
    }

    $('#settings_gamefield_cell_size input')
        .attr('value',LINES.gamefield_cell_size)
        .change(
            function()
            {
                var gamefield_cell_size = parseInt(this.value, 10);
                if(gamefield_cell_size >= 1)
                {
                    LINES.gamefield_cell_size = gamefield_cell_size;
                    LINES.restartGame(true);
                }
                else
                {
                    this.value = LINES.gamefield_cell_size;
                    LINES.alert(LINES.error_invalid_value);
                }
                LINES.storage.saveSettings();
            });

    LINES.initGame();
});
