_prev=""
for x in $(find _docs/ -type f); do
  if [ -z $_prev ]; then
    echo "Press “l” key to review file “$x”."
    while read -n1 _inp; do
      [ $_inp == "l" ] && break
    done
    git diff $(grep -oe "Reviewed at [^)]*" $x | cut -d\  -f3) $x
  else
    echo "Press “l” key to review file “$x” and “h” key to go back to file “$_prev”."
    while read -n1 _inp; do
      [ $_inp == "l" ] || [ $_inp == "h" ] && break
    done
    [ $_inp == "h" ] && \
      git diff $(grep -oe "Reviewed at [^)]*" $_prev | cut -d\  -f3) $_prev
    echo "Press “l” key to review file “$x”."
    while read -n1 _inp; do
      [ $_inp == "l" ] && break
    done
    git diff $(grep -oe "Reviewed at [^)]*" $x | cut -d\  -f3) $x
  fi
  _prev=$x
done
