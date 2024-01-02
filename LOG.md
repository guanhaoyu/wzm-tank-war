# wzm-tank-war
war of tanks develope by weizaomao

### TIP:

- type -> drawImage

### 偶现bug:

- 偶现敌坦克和右侧数量不匹配问题，右侧已经没了，但是还在新增敌坦克

- 偶现一次p1凭空出现护盾问题

- 偶现一次p1重生时和敌坦克发生重叠的情况，调试思路：只生成一个敌坦克，消灭p1后瞬移到复活点。✅原因：从birth中抽出rebirth时，requestAnimationFrame里调的还是birth，导致在下一帧直接复活了，没有再次判断复活点有无障碍；但是不可以在此处调raf，在复活点始终有障碍物的情况下会爆栈，因为此处的raf意味着在每次更新画布时让js栈内rebirth函数增加一个，越往后随着画布更新次数增多每一帧要重复执行的rebirth也增加得越来越多，爆栈。更新动作不管是setTimeout还是raf都应该在最顶层且只有一个，故把BattleField里的protectHome中的raf也删掉

### feature: 

- 雪地可加效果

- 单机双人模式

- 联网多人模式

- 兼容性处理

- 毁灭后的家✅

- 音效✅

- 游戏失败✅

- 水完善被子弹穿过的特性✅

- 自动进入下一关✅

- 考虑敌方坦克管理器❎

- 敌坦克出生方向随机✅

- 奖励碰撞✅

- 奖励位置✅

- 保卫家园奖励代码优化✅

- 联动计分板，关卡更新✅

- e3褪色✅

- 暂停和恢复做成按键操控✅

- player重生✅

- 坦克无敌状态调优✅

- 坦克爆炸✅

- 敌方发射子弹✅

- 发射CD✅

### 已知bug

- 保卫家园时坦克进入范围会被困住✅

- p重生时会卡住重生位置的坦克✅

- 有些reward画出来一开始会闪烁一下不知道为什么，有点像掉帧，因为如果把敌坦克isStop设为true的话，reward就不会闪烁。✅原因：可能是sparkManager.delete性能太差导致的掉帧，改为不使用delete也确实好了，但是却也无法解释为什么用setTimeout 100还是会出现一闪的情况。————可以解释，setTimeout只是降低了画布更新频率，帧率还是没变，该掉帧还是掉帧。————存疑：不是掉帧，是因为在sparkManager.draw的过程中改变sparkManager.arr，例如一开始```arr = [blink, reward]```，接着当blink持续时间结束要显示坦克时，blink.draw中调用了sparkManager.delete删除了arr中的第一个元素blink，导致```arr = [reward]```，但此时sparkManager.draw中的arr.forEach仍在执行且index=1，但因为arr删除了第一个元素，使得arr长度变为1，那么arr[1]就是undefined了，也就不可能执行arr[1].draw（实际上应该是index和length一样了，循环终止），相当于没有执行reward.draw，所以少画一次reward，看上去好像reward掉了一帧，这件事再一次表明不要在循环里轻易去改变原数组顺序否则容易出现意想不到的bug

- p1复活时可以二连发问题。✅原因：birth时coolDownFrames没有重置为0，导致birth时shootable为true，打出第一下，下一帧coolDownFrames等于limit，shootable又为true，又能开一炮

- 和home的碰撞检测，坦克能开过去✅

- 为什么Tank中isCollision第一个入参是this就不行。✅原因：新构造了一个对象，上面没有读取器

- 碰撞时避免坦克插入坦克。✅原因：e3碰到p（非递进move，递进move其实也一样），（以e3在上p在下为例）贴边，e3转向，如果转向上，则不会出问题；如果转向左或右，e3的y轴长度-2，p往前一步，插入，导致e3即使转向上，也会碰撞检测为true。所以如果e3速度大于2，那么e3和p相向运动时间距就不会小于等于2，也就不会发生因左右转向而被p插入的情况。————解决方案为坦克碰撞检测时，宽高取值为宽高的最大值

- 因为碰撞检测，地图块宽度和坦克一样导致判定碰撞了，理论上起点或终点相同确实应该算作重叠 ✅

- 敌方坦克可以穿过玩家坦克✅

- 子弹保证某一帧左侧有黑边✅


