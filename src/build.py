import re
imp='''import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
try{ await Promise.race([Promise.all([document.fonts.load('800 100px "Saira Condensed"'),document.fonts.load('600 14px "Saira"')]), new Promise(r=>setTimeout(r,1800))]); }catch(e){}
'''
out=open('head.html').read()+'<script type="module">\n'+imp+open('world.js').read()+'\n'+open('sim.js').read()+'\n'+open('audio.js').read()+'\n'+open('game.js').read()+'\n</script>\n</body></html>\n'
open('index.html','w').write(out)
open('/tmp/g.mjs','w').write(re.search(r'<script type="module">(.*?)</script>',out,re.S).group(1))
