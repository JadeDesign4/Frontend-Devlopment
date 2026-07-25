from pathlib import Path

p = Path('/home/user/uploads/card.html')
t = p.read_text()
q = chr(34)
p.write_text(t.replace('fill=' + q + '#fff' + q, 'fill=' + q + 'currentColor' + q))
print('card.html SVG fill updated')
