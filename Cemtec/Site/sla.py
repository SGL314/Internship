i = 5
for i in range (5,44):
    print(f"{int(i/2)}:{i%2*30}{'0' if ((i)%2*30==0) else '' } - {int((i+1)/2)}:{(i+1)%2*30}{'0' if ((i+1)%2*30==0) else '' }")
    i+=1