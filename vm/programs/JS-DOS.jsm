.global_def font.red, 0b0000111100000000;
.global_def font.green, b0000000011110000;
.global_def font.blue, b0000000000001111;
.global_def font.clear_screen, b100000000000;
.global_def font.italics, b0100000000000000;
.global_def font.bold, b0010000000000000;

.org $6000;
.label file.start:
.data16 text.length, {(!reset.vector - !file.start + 2)};

.label function.main:
mov (!font.green + !font.italics + !font.bold), [!_memory_map.screen_address];

mov 'H, [!_memory_map.screen_address + 1];
mov 'e, [!_memory_map.screen_address + 2];
mov 'l, [!_memory_map.screen_address + 3];
mov 'l, [!_memory_map.screen_address + 4];
mov 'o, [!_memory_map.screen_address + 5];
mov $20, [!_memory_map.screen_address + 6];
mov 'W, [!_memory_map.screen_address + 7];
mov 'o, [!_memory_map.screen_address + 8];
mov 'r, [!_memory_map.screen_address + 9];
mov 'l, [!_memory_map.screen_address + 10];
mov 'd, [!_memory_map.screen_address + 11];
mov '!, [!_memory_map.screen_address + 12];
hlt;

.data16 reset.vector, {!function.main};