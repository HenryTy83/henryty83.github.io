.org $b000;
.label file.start:
.data16 text.length, {(!reset_vector - !file.start + 2)};

//                          Reboot on key press
.label OS.throw_fatal_error:
    mov r1, [!_memory_map.hard_drive];

    cal !OS.reset, [!OS.IO.on_key_press];

    mov !Font.red, [!_memory_map.screen_address];
    mov r0, x;
    mov r0, y;

    cal !OS.data.error, [!OS.IO.console.print];

    .label hang:
    jmp [!hang];

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

//                          displays the cursor
.global_label OS.IO.display_cursor:
    mov r1, [!_memory_map.hard_drive];

    cal [!OS.IO.blink_cursor];
    mov &SP, acc;

    jez [!OS.IO.display_cursor.end];
        mov r1, [!_memory_map.hard_drive];
        mov [!OS.IO.console.cursor.pos], mar;
        mov acc, &mar;
    .label OS.IO.display_cursor.end:
    
    rts;

//                          blinks the cursor
.global_label OS.IO.blink_cursor:
    mov r1, [!_memory_map.hard_drive];

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
    mov r1, [!_memory_map.hard_drive];

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
    mov r1, [!_memory_map.hard_drive];

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
    mov r1, [!_memory_map.hard_drive];

    mov [!OS.IO.console.cursor.pos], acc;
    cal acc, [!OS.IO.console.set_cursor_pos];

    mov &SP, acc;
    mov acc, &FP;
    rts;

//                          Write a null-terminated string to the cursor pos
.global_label OS.IO.console.print:
    mov r1, [!_memory_map.hard_drive];

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
    mov r1, [!_memory_map.hard_drive];

    cal [!OS.IO.console.get_cursor_pos];
    inc y;
    mov r0, x;
    cal [!OS.IO.console.move_cursor];
    mov &SP, x;
    mov x, &FP;
    rts;

//                          Call with the address of a callback function and the function will be called with keypress as argument
.global_label OS.IO.on_key_press:
    mov r1, [!_memory_map.hard_drive];

    mov &FP, mar;
    mov mar, [!OS.IO.key_press_callback];
    mov !OS.IO.handle_key_press, [!_hardware.interrupt_vector.keyboard];
    rts;

.label OS.IO.handle_key_press:
    mov r1, [!_memory_map.hard_drive];

    mov [!_memory_map.keyboard], w;
    cal w, [!OS.IO.key_press_callback.run];
    rti;

    .label OS.IO.key_press_callback.run:
    mov [!OS.IO.key_press_callback], PC;

//                          Call with address, frees up memory to be used again
.global_label OS.free:
    mov r1, [!_memory_map.hard_drive];

    mov &FP, x;
    mov !OS.mallocs, mar;

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
    mov r1, [!_memory_map.hard_drive];

    mov &FP, d;
    mov r0, x;
    mov !OS.mallocs, mar;

    .label OS.malloc.search:
        mov x, &FP;

        mov &mar, w;
        mov x, acc;

        jlt w, [!OS.malloc.search.out_of_range]
        jmp [!OS.malloc.search.not_found];

        .label OS.malloc.search.out_of_range:
        add x, d;
        jlt w, [!OS.malloc.found];

        .label OS.malloc.search.not_found:
    
        mov w, acc;
        jne $ffff, [!OS.malloc.memory_available];
            cal r0, [!OS.throw_fatal_error];
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

.global_label String.equal:
    mov &x, acc;
    mov &y, d;
    jne d, [!String.equal.false];

    inc x;
    inc x;
    inc y;
    inc y;

    jnz [!String.equal];

    mov r1, &FP;
    rts;

    .label String.equal.false:
    mov r0, &FP;
    rts;


.label OS.main:
    mov r1, [!_memory_map.hard_drive];

    //                              initialize malloc
    mov r0,    [!OS.mallocs + (4*0)];
    mov $0fff, [!OS.mallocs + (4*0 + 2)];
    mov $a000, [!OS.mallocs + (4*1)];
    mov $4001, [!OS.mallocs + (4*1) + 2];
    mov $ffff, [!OS.mallocs + (4*2)];
    mov $ffff, [!OS.mallocs + (4*2) + 2];

    //                              initialize sleep timer and interrupts
    mov r0, [!_memory_map.sleep_timer];

    mov !Font.clear_screen, [!_memory_map.screen_address];
    mov (!Font.green), [!_memory_map.screen_address];

    mov r0, x;
    mov r0, y;
    cal [!OS.IO.console.move_cursor];

    cal !OS.data.loading_string, [!OS.IO.console.print];
    cal 10, [!OS.sleep];
    cal !OS.data.welcome_string, [!OS.IO.console.print];
    cal 10, [!OS.sleep];

    mov b1111111111111111, IM;
    
    cal 10, [!OS.malloc];
    mov &SP, mar;
    mov mar, [!OS.console.buffer];
    mov r0, &mar;
    cal !console.enter_command, [!OS.IO.on_key_press];
    
.label OS.loop:
    mov r1, [!_memory_map.hard_drive];

    mov !Font.clear_screen, [!_memory_map.screen_address];
    mov (!Font.green), [!_memory_map.screen_address];

    mov r0, x;
    mov r0, y;
    cal [!OS.IO.console.move_cursor];

    cal !OS.data.header_string, [!OS.IO.console.print];
    cal [!OS.console.buffer], [!OS.IO.console.print];

    cal [!OS.IO.display_cursor];

    cal r1, [!OS.sleep];
    jmp [!OS.loop];

.label console.enter_command:
    mov r1, [!_memory_map.hard_drive];
    mov &FP, acc;

    jne !String.newline, [!console.enter_command.check_backspace];
        cal [!OS.console.buffer], [!console.run_command];
        rts;

    .label console.enter_command.check_backspace:
    jne !Input.backspace, [!console.enter_command.check_valid];
        mov r0, [!OS.console.command_length];
        mov [!OS.console.buffer], acc;
        mov r0, &acc;
        rts;
    .label console.enter_command.check_valid:

    jlt $20, [!console.enter_command.end];
    jgt $7e, [!console.enter_command.end];

    mov acc, d;
    
    mov [!OS.console.command_length], acc;
    jeq 4, [!console.enter_command.end];

    mov acc, mar;
    inc mar;
    mov mar, [!OS.console.command_length];

    mul acc, 2;
    mov [!OS.console.buffer], mar;
    add acc, mar;

    mov d, &acc;
    
    add acc, 2;
    mov r0, &acc;

    .label console.enter_command.end:
    rts;

.label console.run_command:
    mov r1, [!_memory_map.hard_drive];

    mov !OS.console.command_lookup, mar;
    mov r0, d;

    .label console.run_command.parse:
        mov &FP, x;

        mul d, 5;
        add acc, mar;
        mov acc, y;

        psh d;
        cal [!String.equal];
        pop d;

        mov &SP, acc;
        jnz [!console.command_found];

        inc d;
        mov d, acc;
        jlt 6, [!console.run_command.parse];

    .label console.command_found:
        mov [!OS.console.buffer], mar;
        mov r0, &mar;

        mov r0, [!OS.console.command_length];

        mul d, 2;
        hlt; 

        add acc, !command_lookup;

        mov &acc, PC;

.data16 command_lookup, {
    !console.display_help, !console.display_credits, !console.list_files, !console.open_file, !console.copy_file, !console.delete_file, !console.unknown_command
};

.label console.display_help:
.label console.display_credits:
.label console.list_files:
.label console.open_file:
.label console.copy_file:
.label console.delete_file:
rts;
.label console.unknown_command:
hlt;


.data16 reset_vector, { !OS.main };