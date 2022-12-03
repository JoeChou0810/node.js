function sum(num) {
    let sum=0;
    if (num < 0) {
        for (i = 0; i >= num; i--)
            sum += i;
    } else {
        for (i = 0; i <= num; i++) {
            sum += i;
        }
    }
    console.log(sum);
}
sum(5)
sum(2)