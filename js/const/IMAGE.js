/********************图片资源********************/
const MENU_IMAGE = new Image()
MENU_IMAGE.src = 'images/menu.gif'

const RESOURCE_IMAGE = new Image()
RESOURCE_IMAGE.src = 'images/tankAll.gif'

/********************各个图块在图片中的位置********************/
const POS = {}
POS['selectTank'] = [128, 96]
POS['stageLevel'] = [396, 96]
POS['num'] = [256, 96]
POS['map'] = [0, 96]
POS['home'] = [256, 0]
POS['score'] = [0, 112]
// POS['player'] = [0, 0]
POS['player'] = [3, 3]
POS['protected'] = [160, 96]
POS['enemyBefore'] = [256, 32]
// POS['enemy1'] = [0, 32]
POS['enemy1'] = [3, 35]
// POS['enemy2'] = [128, 32]
POS['enemy2'] = [132, 34]
// POS['enemy3'] = [0, 64]
POS['enemy3'] = [3, 66]
// POS['bullet'] = [80, 96]
POS['bullet'] = [81, 96]
POS['tankBomb'] = [0, 160]
// POS['bulletBomb'] = [320, 0]
POS['bulletBomb'] = [321, 0]
POS['over'] = [384, 64]
POS['prop'] = [256, 110]

export { MENU_IMAGE, RESOURCE_IMAGE, POS }
