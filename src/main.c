extern void prints(char* str);

int main() {
    prints("hello world from C!");
    return 0;
}

int runBench(int iter) {
    int result = 0;
    for (int i = 0; i < iter; i++) result++;

    return result;
}