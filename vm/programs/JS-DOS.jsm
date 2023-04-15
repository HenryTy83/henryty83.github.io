.global_def Font.clear_screen,  b1000000000000000;
.global_def Font.italics,       b0100000000000000;
.global_def Font.bold,          b0010000000000000;
.global_def Font.red,           b0000111100000000;
.global_def Font.green,         b0000000011110000;
.global_def Font.blue,          b0000000000001111;

.global_def String.newline, $0a;
.global_def String.space, $20;
.global_def String.colon, $3a;

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

.global_def screen.chars_per_row, $4e;

.org $b000;
.label file.start:
.data16 text.length, {(!reset.vector - !file.start + 2)};

//                          Just halts for now
.label OS.throw_fatal_error:
    mov !Font.red, [!_memory_map.screen_address];
    mov r0, x;
    mov r0, y;
    cal !String.error, [!OS.IO.console.print];
    hlt;

.data16 String.error, {
    'F, 'a, 't, 'a, 'l, !String.space, 'E, 'r, 'r, 'o, 'r, !String.space, $2639, !String.newline, $00
};

.data16 String.out_of_ram_error, {
    'O, 'u, 't, !String.space, 'o, 'f, !String.space, 'R, 'A, 'M, !String.newline, $00
};

.global_label OS.reset:
    bki [!bootloader.main];

//                          sleep for &FP * 100 ms
.global_label OS.sleep:
    mov &FP, d;
    mov [!_memory_map.sleep_timer], acc;
    add acc, d;

    .label OS.sleep.loop:
        jgt [!_memory_map.sleep_timer], [!OS.sleep.loop];
    
    rts;


.global_data16 OS.IO.console.cursor.pos, { (!_memory_map.screen_address + 1) };
.global_data16 OS.IO.console.cursor.pos.x, { 0 };
.global_data16 OS.IO.console.cursor.pos.y, { 0 };
.data16 OS.IO.console.cursor.char, { 0 };
.data16 OS.IO.console.cursor.timer, { 0 };

.global_data16 OS.IO.console.cursor.blink_time, { 3 };
.global_data16 OS.IO.console.cursor.char_template, { $2588 };

//                          displays the cursor
.global_label OS.IO.display_cursor:
    cal [!OS.IO.blink_cursor];
    mov &SP, acc;

    jez [!OS.IO.display_cursor.end];
        mov [!OS.IO.console.cursor.pos], mar;
        mov acc, &mar;
    .label OS.IO.display_cursor.end:
    
    rts;

//                          blinks the cursor
.global_label OS.IO.blink_cursor:
    mov [!_memory_map.sleep_timer], acc;
    jlt [!OS.IO.console.cursor.timer], [!OS.IO.blink_cursor.skip];

        mov [!OS.IO.console.cursor.blink_time], d;
        add acc, d;
        mov acc, [!OS.IO.console.cursor.timer];

        mov [!OS.IO.console.cursor.char], acc;
        mov [!OS.IO.console.cursor.char_template], d;
        sub d, acc;
        mov acc, [!OS.IO.console.cursor.char];

    .label OS.IO.blink_cursor.skip:
    mov [!OS.IO.console.cursor.char], acc;
    mov acc, &FP; 
    rts; 

//                          Move the cursor to the coordinates in the x and y register
.global_label OS.IO.console.move_cursor:
    mul y, !screen.chars_per_row;
    add acc, x;
    add acc, (!_memory_map.screen_address + 1);

    jlt !_memory_map.screen_address.end, [!OS.IO.console.move_cursor.valid_address];
        sub !_memory_map.screen_address.end, r1;
    .label OS.IO.console.move_cursor.valid_address:

    mov acc, [!OS.IO.console.cursor.pos];
    mov acc, &FP;
    mov x, [!OS.IO.console.cursor.pos.x];
    mov y, [!OS.IO.console.cursor.pos.y];
    rts;

//                          Draw a character to the coordinates in the x and y registers, without moving it
.global_label OS.IO.console.draw_char:
    mul y, !screen.chars_per_row;
    add acc, x;
    add acc, (!_memory_map.screen_address + 1);
    mov &FP, w;
    mov w, &acc;
    mov acc, &FP;
    rts;

//                          Move the cursor to a raw address
.global_label OS.IO.console.set_cursor_pos:
    mov &FP, acc;
    mov acc, [!OS.IO.console.cursor.pos];
    
    sub acc, !_memory_map.screen_address;
    mov r0, y;

    .label OS.IO.console.set_cursor_pos.find_row;
        jlt !screen.chars_per_row, [!OS.IO.console.set_cursor_pos.find_column];
        inc y;
        sub acc, !screen.chars_per_row;
        jmp [!OS.IO.console.set_cursor_pos.find_row];
    
    .label OS.IO.console.set_cursor_pos.find_column:
        mov acc, [!OS.IO.console.cursor.pos.x];
        mov y, [!OS.IO.console.cursor.pos.y];
    rts;

//                          Write the cursors coords to the x and y registers

.global_label OS.IO.console.get_cursor_pos:
    mov [!OS.IO.console.cursor.pos], acc;
    cal acc, [!OS.IO.console.set_cursor_pos];

    mov &SP, acc;
    mov acc, &FP;
    rts;

//                          Write a null-terminated string to the cursor pos
.global_label OS.IO.console.print:
    mov &FP, x;
    mov [!OS.IO.console.cursor.pos], y;
    mov y, &FP;
    
    mov &x, acc;
    jez [!OS.IO.console.print.end];

    .label OS.IO.console.print.loop:
        mov acc, &y;
        
        inc x;
        inc x;  
        inc y;

        .label OS.IO.console.print.fetch_next_char:
            mov &x, acc;

            jne !String.newline, [!OS.IO.console.print.check_end];

            psh x;
            mov y, [!OS.IO.console.cursor.pos];
            cal [!OS.IO.console.newline];
            mov &SP, y;
            pop x;
            inc x;
            inc x;
            jmp [!OS.IO.console.print.fetch_next_char];

            .label OS.IO.console.print.check_end:
                jnz [!OS.IO.console.print.loop];
    
    mov y, [!OS.IO.console.cursor.pos];
    .label OS.IO.console.print.end:
    rts;

//                                  move the cursor to the next line
.global_label OS.IO.console.newline:
    cal [!OS.IO.console.get_cursor_pos];
    inc y;
    mov r0, x;
    cal [!OS.IO.console.move_cursor];
    mov &SP, x;
    mov x, &FP;
    rts;



//                          Call with the address of a callback function and the function will be called with keypress as argument
.global_label OS.IO.on_key_press:
    mov &FP, mar;
    mov mar, [!key_press_callback];
    mov !OS.IO.handle_key_press, [!_hardware.interrupt_vector.keyboard];
    rts;

.label OS.IO.handle_key_press:
    mov [!_memory_map.keyboard], w;
    cal w, [!OS.IO.key_press_callback.run];
    rti;
.label OS.IO.key_press_callback.run:
    mov [!key_press_callback], PC;

.data16 key_press_callback, { !OS.reset };



//                          Call with address, frees up memory to be used again
.global_label OS.free:
    mov &FP, x;
    mov !mallocs, mar;

    .label OS.free.search:
        mov &mar, w;
        mov w, acc;
        
            jne $ffff, [!OS.free.memory_available];
            rts;
            .label OS.free.memory_available;

        add mar, 4;
        mov acc, mar;
        sub x, w;
        jnz [!OS.free.search];

    mov mar, x;
    sub mar, 4;
    mov acc, y;
    

    .label OS.free.found:
        mov &x, acc;
        mov acc, &y;

        inc x;
        inc x;
        inc y;
        inc y;

        jne $ffff, [!OS.free.found];
    
    mov $ffff, &y;
    rts;



//                          Call with a buffer size. Returns address at start of reserved block of memory
.global_label OS.malloc:
    mov &FP, d;
    mov r0, x;
    mov !mallocs, mar;

    .label OS.malloc.search:
        mov x, &FP;
        add x, d;
        mov &mar, w;
        jlt w, [!OS.malloc.found];

        mov w, acc;
        jne $ffff, [!OS.malloc.memory_available];
            cal 0, [!OS.throw_fatal_error];
        .label OS.malloc.memory_available:
    
        inc mar;
        inc mar;
        add x, w;
        mov acc, x;
        inc x;
        inc mar;
        inc mar;
        jmp [!OS.malloc.search];


        .label OS.malloc.found:
            mov &mar, w;
            mov x, &mar;
            inc mar;
            inc mar;
            mov &mar, acc;
            mov d, &mar;

            mov w, x;
            mov acc, d;

            inc mar;
            inc mar;

            jnz [!OS.malloc.found];
    rts;





.label OS.main:
    //                              initialize malloc
    mov r0,    [!mallocs + (4*0)];
    mov $0fff, [!mallocs + (4*0 + 2)];
    mov $a000, [!mallocs + (4*1)];
    mov $4001, [!mallocs + (4*1) + 2];
    mov $ffff, [!mallocs + (4*2)];
    mov $ffff, [!mallocs + (4*2) + 2];

    //                              initialize sleep timer and interrupts
    mov r0, [!_memory_map.sleep_timer];

    mov b1111111111111111, IM;
    
    .label OS.loop:
        mov !Font.clear_screen, [!_memory_map.screen_address];
        mov (!Font.green), [!_memory_map.screen_address];

        mov r0, x;
        mov r0, y;
        cal [!OS.IO.console.move_cursor];

        cal !OS.header_string, [!OS.IO.console.print];
        cal [!OS.IO.display_cursor];

        cal r1, [!OS.sleep];
        jmp [!OS.loop];

.data16 OS.header_string, { 
    'S, 't, 'a, 'r, 't, 'i, 'n, 'g, !String.space, 'J, 'S, '-, 'D, 'O, 'S, '., '., '., !String.newline,
    !String.newline,
    'W, 'e, 'l, 'c, 'o, 'm, 'e, '!, !String.newline,
    'C, !String.colon, '/, '>, $00
};

.data16 OS.credits_string, {
    $250C, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2510, !String.newline,
    $2502, 'T, 'J, 'S, 'V, 'M, 'T, 'D, 'H, 'A, 'A, !String.space, 'v, '1, '., '0, $2502, !String.newline,
    $2502, 'J, 'S, '-, 'D, 'O, 'S, !String.space, 'v, '0, '., '1, !String.space, !String.space, !String.space, !String.space, $2502, !String.newline,
    $2514, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $2500, $251A, !String.newline,
    $00
};





.data16 reset.vector, {!OS.main};



.data16 mallocs, { $0000 };