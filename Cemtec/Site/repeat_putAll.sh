qt=0
while true;
do
    python3 putAll.py;
    qt=$(echo $qt+1 | bc);
    echo $qt
    sleep 5;
done