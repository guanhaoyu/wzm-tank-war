# wzm-tank-war
war of tanks develope by weizaomao

TIP:

- type -> drawImage

TODO: 

- 音效

- 单机双人模式

- 联网多人模式

- 和home的碰撞检测，坦克能开过去✅

- 敌坦克出生方向随机✅

- 奖励碰撞✅

- 奖励位置✅

- 保卫家园奖励代码优化

- 联动计分板，关卡更新

- e3褪色✅

- 暂停和恢复做成按键操控✅

- player重生✅

- 坦克无敌状态调优✅

- 坦克爆炸✅

- 为什么Tank中isCollision第一个入参是this就不行。✅原因：新构造了一个对象，上面没有读取器

- 碰撞时避免坦克插入坦克。✅原因：e3碰到p（非递进move，递进move其实也一样），（以e3在上p在下为例）贴边，e3转向，如果转向上，则不会出问题；如果转向左或右，e3的y轴长度-2，p往前一步，插入，导致e3即使转向上，也会碰撞检测为true。所以如果e3速度大于2，那么e3和p相向运动时间距就不会小于等于2，也就不会发生因左右转向而被p插入的情况。————解决方案为坦克碰撞检测时，宽高取值为宽高的最大值

- 敌方发射子弹✅

- 子弹保证某一帧左侧有黑边✅

- 发射CD✅

- 因为碰撞检测，地图块宽度和坦克一样导致判定碰撞了，理论上起点或终点相同确实应该算作重叠 ✅

- 敌方坦克可以穿过玩家坦克✅
