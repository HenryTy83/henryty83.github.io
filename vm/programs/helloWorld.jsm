// Simply write the string "Hello World!" to the screen
// test of the assembler and basic code
.def standardSettings $00F0

hlt
// should be skipped

start:
mov !standardSettings &[$8000]
mov $0048 &[$8000]

mov !standardSettings &[$8001]
mov $0065 &[$8001]

mov !standardSettings &[$8002]
mov $006c &[$8002]

mov !standardSettings &[$8003]
mov $006c &[$8003]

mov !standardSettings &[$8004]
mov $006f &[$8004]

mov !standardSettings &[$8005]
mov $0020 &[$8005]

mov !standardSettings &[$8006]
mov $0057 &[$8006]

mov !standardSettings &[$8007]
mov $006f &[$8007]

mov !standardSettings &[$8008]
mov $0072 &[$8008]

mov !standardSettings &[$8009]
mov $006c &[$8009]

mov !standardSettings &[$800a]
mov $0064 &[$800a]

mov !standardSettings &[$800b]
mov $0021 &[$800b]

hlt

// reset vector
.org $7ffe
.data16 reset_vector { !start } 

// 0048 0065 006c 006c 006f 0020 0057 006f 0072 006c 0064 0021