.global_def Font.advance_frame, b1000000000000001;
.global_def Font.clear_screen,  b1000000000000000;
.global_def Font.italics,       b0100000000000000;
.global_def Font.bold,          b0010000000000000;
.global_def Font.red,           b0000111100000000;
.global_def Font.green,         b0000000011110000;
.global_def Font.blue,          b0000000000001111;

.global_def Input.backspace, $08;

.global_def _memory_map.screen_address, $a000;
.global_def _memory_map.screen_address.end, $a751;
.global_def _memory_map.keyboard, $a751;
.global_def _memory_map.sleep_timer, $a752;
.global_def _memory_map.sound.noise, $a753;
.global_def _memory_map.sound.sine, $a754;
.global_def _memory_map.sound.square, $a755;
.global_def _memory_map.sound.sawtooth, $a756;

.global_def _hardware.interrupt_vector.keyboard, $9fe0;
.global_def _hardware.interrupt_vector.sound, $9fe2;

.global_def String.newline, $0a;
.global_def String.space, $20;
.global_def String.hyphen, $2d;
.global_def String.colon, $3a;
.global_def String.open_parenthesis, $28;
.global_def String.close_parenthesis, $29;

.global_def screen.chars_per_row, $4e;

.org $c001;
.label file.start:
.global_data16 text.length, {(!file.end - !file.start)};

.global_data16 OS.IO.console.cursor.pos, { (!_memory_map.screen_address + 1) };
.global_data16 OS.IO.console.cursor.pos.x, { 0 };
.global_data16 OS.IO.console.cursor.pos.y, { 0 };
.global_data16 OS.IO.console.cursor.char, { 0 };
.global_data16 OS.IO.console.cursor.timer, { 0 };

.global_data16 OS.IO.console.cursor.blink_time, { 6 };
.global_data16 OS.IO.console.cursor.char_template, { $2588 };

.global_data16 OS.IO.key_press_callback, { 000 };

.global_data16 OS.data.error, {
    'F, 'a, 't, 'a, 'l, !String.space, 'E, 'r, 'r, 'o, 'r, !String.space, !String.colon, !String.open_parenthesis, !String.newline,
    'P, 'r, 'e, 's, 's, !String.space, 'a, 'n, 'y, !String.space, 'k, 'e, 'y, !String.space, 't, 'o, !String.space, 'r, 'e, 's, 't, 'a, 'r, 't, !String.newline,
    !String.newline,
    0
};

.global_data16 OS.data.out_of_ram_error, {
   'C, 'o, 'd, 'e, !String.space, '0, !String.colon, !String.space, !String.open_parenthesis, 'O, 'u, 't, !String.space, 'o, 'f, !String.space, 'R, 'A, 'M, !String.close_parenthesis, 0
};

.global_data16 OS.data.loading_string, {
    'S, 't, 'a, 'r, 't, 'i, 'n, 'g, !String.space, 'J, 'S, '-, 'D, 'O, 'S, '., '., '., !String.newline,
    !String.newline, 
    0
};

.global_data16 OS.data.welcome_string, {
    'W, 'e, 'l, 'c, 'o, 'm, 'e, '!, 0
};

.global_data16 OS.data.header_string, { 
    'C, !String.colon, '/, '>, 0
};


.global_data16 OS.console.buffer, { 0 };
.global_data16 OS.console.command_length, { 0 };
.global_data16 OS.console.command_result, { $ffff }; 

.global_data16 OS.data.credits_string, {
    $250C, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2510, !String.newline,
    $2502, 'T, 'J, 'S, 'V, 'M, 'T, 'D, 'H, 'A, 'A, !String.space, 'v, '1, '., '0, !String.space, !String.space, $2502, !String.newline,
    $2502, 'J, 'S, '-, 'D, 'O, 'S, !String.space, 'v, '0, '., '1, !String.space, !String.space, !String.space, !String.space, !String.space, !String.space, $2502, !String.newline,
    $2502, $a9, !String.space, 'H, 'e, 'n, 'r, 'y, !String.space, 'T, 'y, !String.space, '2, '0, '2, '2, !String.hyphen, '3, $2502, !String.newline,
    $2514, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $251A, !String.newline,
    !String.newline,
    0
};
.global_data16 OS.data.documentation, {
    'C, 'o, 'm, 'm, 'a, 'n, 'd, !String.space, 'l, 'i, 's, 't, !String.colon, !String.newline,
    'h, 'e, 'l, 'p, !String.colon, !String.space, 's, 'h, 'o, 'w, !String.space, 't, 'h, 'i, 's, !String.space, 'l, 'i, 's, 't, !String.newline,
    'c, 'r, 'e, 'd, !String.colon, !String.space, 's, 'h, 'o, 'w, !String.space, 't, 'h, 'e, !String.space, 'c, 'r, 'e, 'd, 'i, 't, 's, !String.newline,
    'l, 'i, 's, 't, !String.colon, !String.space, 'l, 'i, 's, 't, !String.space, 'f, 'i, 'l, 'e, 's, !String.space, 'i, 'n, !String.space, 't, 'h, 'i, 's, !String.space, 'd, 'i, 'r, !String.newline,
    'o, 'p, 'e, 'n, !String.colon, !String.space, 'o, 'p, 'e, 'n, !String.space, 'a, !String.space, 'f, 'i, 'l, 'e, !String.space, 'o, 'r, !String.space, 'f, 'o, 'l, 'd, 'e, 'r, !String.space, 'i, 'n, !String.space, 't, 'h, 'i, 's, !String.space, 'd, 'i, 'r, !String.newline, 
    'c, 'o, 'p, 'y, !String.colon, !String.space, 'c, 'o, 'p, 'y, !String.space, 'a, !String.space, 'f, 'i, 'l, 'e, !String.space, 't, 'o, !String.space, 'a, 'n, 'o, 't, 'h, 'e, 'r, !String.space, 'f, 'i, 'l, 'e, !String.space, 'i, 'n, !String.space, 't, 'h, 'i, 's, !String.space, 'd, 'i, 'r, !String.newline, 
    'r, 'm, 'r, 'f, !String.colon, !String.space, 'd, 'e, 'l, 'e, 't, 'e, !String.space, 'a, !String.space, 'f, 'i, 'l, 'e, !String.space, 'i, 'n, !String.space, 't, 'h, 'i, 's, !String.space, 'd, 'i, 'r, !String.newline,
    'b, 'a, 'c, 'k, !String.colon, !String.space, 'm, 'o, 'v, 'e, !String.space, 't, 'o, !String.space, 't, 'h, 'e, !String.space, 'p, 'a, 'r, 'e, 'n, 't, !String.space, 'd, 'i, 'r, !String.newline,
    'q, 'u, 'i, 't, !String.colon, !String.space, 'h, 'a, 'l, 't, !String.space, 'e, 'x, 'e, 'c, 'u, 't, 'i, 'o, 'n, !String.newline,
    !String.newline,
    0
};

.global_data16 OS.data.unknown_command, {
    'U, 'n, 'k, 'n, 'o, 'w, 'n, !String.space, 'c, 'o, 'm, 'm, 'a, 'n, 'd, '., !String.space, 'T, 'y, 'p, 'e, !String.space, 'h, 'e, 'l, 'p, !String.space, 'f, 'o, 'r, !String.space, 'm, 'o, 'r, 'e, !String.space, 'i, 'n, 'f, 'o, !String.newline,
    !String.newline,
    0
};

.global_data16 OS.console.command_lookup, {
    'h, 'e, 'l, 'p, 0,
    'c, 'r, 'e, 'd, 0,
    'l, 'i, 's, 't, 0,
    'o, 'p, 'e, 'n, 0,
    'c, 'o, 'p, 'y, 0,
    'r, 'm, 'r, 'f, 0,
    'b, 'a, 'c, 'k, 0,
    'q, 'u, 'i, 't, 0
};

.label file.end:

.global_data16 OS.mallocs, { 0 };