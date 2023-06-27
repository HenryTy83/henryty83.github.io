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
.global_def String.colon, $3a;

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

.global_data16 OS.IO.key_press_callback, { $0000 };

.global_data16 OS.data.error, {
    'F, 'a, 't, 'a, 'l, !String.space, 'E, 'r, 'r, 'o, 'r, !String.space, $2639, !String.newline, 
    $00
};

.global_data16 OS.data.out_of_ram_error, {
    'O, 'u, 't, !String.space, 'o, 'f, !String.space, 'R, 'A, 'M, !String.newline, 
    $00
};

.global_data16 OS.data.loading_string, {
    'S, 't, 'a, 'r, 't, 'i, 'n, 'g, !String.space, 'J, 'S, '-, 'D, 'O, 'S, '., '., '., !String.newline,
    !String.newline, 
    $00
};

.global_data16 OS.data.welcome_string, {
    'W, 'e, 'l, 'c, 'o, 'm, 'e, '!, $00
};

.global_data16 OS.data.header_string, { 
    'C, !String.colon, '/, '>, $00
};

.global_data16 OS.data.credits_string, {
    $250C, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2510, !String.newline,
    $2502, 'T, 'J, 'S, 'V, 'M, 'T, 'D, 'H, 'A, 'A, !String.space, 'v, '1, '., '0, $2502, !String.newline,
    $2502, 'J, 'S, '-, 'D, 'O, 'S, !String.space, 'v, '0, '., '1, !String.space, !String.space, !String.space, !String.space, $2502, !String.newline,
    $2514, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $251A, !String.newline,
    $00
};

.global_data16 OS.console.buffer, { 0 };
.global_data16 OS.console.command_length, { 0 };

.global_data16 OS.console.command_lookup, {
    'h, 'e, 'l, 'p, 0,
    'c, 'r, 'e, 'd, 0,
    'l, 'i, 's, 't, 0,
    'o, 'p, 'e, 'n, 0,
    'c, 'o, 'p, 'y, 0,
    'r, 'm, 'r, 'f, 0
};

.label file.end:

.global_data16 OS.mallocs, { $0000 };