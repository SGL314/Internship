q=1
while [ 1 -eq 1 ]; do
    echo $q
    python3 encloser.py
    q=$(echo "$q+1" | bc)
    sleep 2
done



