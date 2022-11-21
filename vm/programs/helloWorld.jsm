// Simply write the string "Hello World!" to the screen
// test of the assembler and basic code
mov $80F0 &[$8000]
mov $0048 &[$8000]

mov $80F0 &[$8001]
mov $0065 &[$8001]

mov $80F0 &[$8002]
mov $006c &[$8002]

mov $80F0 &[$8003]
mov $006f &[$8003]

mov $80F0 &[$8004]
mov $0020 &[$8004]

mov $80F0 &[$8005]
mov $0057 &[$8005]

mov $80F0 &[$8006]
mov $006f &[$8006]

mov $80F0 &[$8007]
mov $0072 &[$8007]

mov $80F0 &[$8008]
mov $006c &[$8008]

mov $80F0 &[$8009]
mov $0064 &[$8009]

mov $80F0 &[$800a]
mov $0021 &[$800a]

hlt

// 0048 0065 006c 006c 006f 0020 0057 006f 0072 006c 0064 0021