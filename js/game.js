var GAME = function(positions, page1, page2) {
    var panel = page1.find('.girl-acne-wrap'),
        cloud = page1.find('.banner-text-countdown'),
        eleAcneNo = page2.find('#acneNo'),
        eleAcneTitle = page2.find('#acneTitle'),
        eleAcneDesc = page2.find('#acneDesc'),
        maskImg = page2.find('.mask-img'),
        mask = page2.find('.mask');


    var _game = {
        maxNoOfAcne: 11,
        level: 0,
        NoOfAcne: 2,
        totalAcne: 0,
        sequence: 1,
        acnes: [],
        waitingTime: 3000,
        status: 0,
        remarks: [{
            title: "初生挤痘士",
            desc: "相信你是手抖点错了，赶紧再来过吧"
        }, {
            title: "菜鸟挤痘士",
            desc: "一只小呀小菜鸟，加油成长起来"
        }, {
            title: "稀泥挤痘士",
            desc: "痘痘君都在笑你了，给点力吧稀泥痘士"
        }, {
            title: "水泥挤痘士",
            desc: "不错不错，再努努力，单车变摩托"
        }, {
            title: "生铁挤痘士",
            desc: "不错不错，再努努力，单车变摩托"
        }, {
            title: "不锈钢挤痘士",
            desc: "干得漂亮，你绝对是个合格的挤痘士"
        }, {
            title: "青铜挤痘士",
            desc: "good！连女神雅典娜都要赞扬你的战痘能力了"
        }, {
            title: "白银挤痘士",
            desc: "太棒了，恭喜你成为挤痘士中的高级人才"
        }, {
            title: "黄金挤痘士",
            desc: "你的能力已经让痘痘君闻风丧胆"
        }, {
            title: "白金挤痘士",
            desc: "你的能力已经让痘痘君闻风丧胆"
        }, {
            title: "钛合金挤痘士",
            desc: "这绝对是个凤毛麟角的成绩，太赞了！"
        }, {
            title: "钻石挤痘士",
            desc: "离神最近的痘士，你该接受好友的膜拜"
        }, {
            title: "神级挤痘士",
            desc: "你就是存在于传说中的神级挤痘士！还不炫耀炫耀"
        }]
    };



    _game.validate = function(node) {
        if (this.sequence == node.index) {
            this.sequence++;
            this.totalAcne++;
            if (this.sequence > this.NoOfAcne) {
                return 2
            }
            return 1;
        }
        _game.end();
        return 0;
    }

    _game.nextLevel = function() {
        _game.status = 0,
            _game.sequence = 1,
            _game.NoOfAcne++;
        if (_game.NoOfAcne >= 6) {
            _game.waitingTime = 4000;
        }

        if (_game.NoOfAcne > _game.maxNoOfAcne) {
            _game.end();
        } else {
            randomAcnes();
            cloud.html('<span>还有</span> <span class="second">4</span> <span>秒，抓紧时间记忆</span>');
            countdown(_game.waitingTime / 1000);
        }
    }


    _game.end = function() {
        var tot = this.totalAcne;
        this.status = 1;
        eleAcneNo.text(this.totalAcne);
        if (this.totalAcne > 60)
            tot = 60;

        var lvl = Math.floor(tot / 5);
        eleAcneTitle.text(this.remarks[lvl].title + ' (lv' + lvl + ')');
        eleAcneDesc.text(this.remarks[lvl].desc);
        this.level = lvl;
        page1.hide();
        page2.show();
    }

    _game.restart = function() {
        this.currentLevel = 1,
            this.NoOfAcne = 2,
            this.totalAcne = 0,
            this.sequence = 1,
            this.level = 0,
            this.acnes = [];

        page1.show();
        page2.hide();
        this.nextLevel();
    }

    _game.share = function() {
        maskImg.show();
        mask.show();
    }

    _game.unShare = function() {
        maskImg.hide();
        mask.hide();
    }

    function randomAcnes() {
        panel.empty();
        _game.acnes = [];
        var exists = [];
        for (var i = 0; i < _game.NoOfAcne; i++) {
            var p = randomPosition(positions, exists);
            exists.push(p);
            var acne = new Acne(_game, (i + 1), positions[p]);
            _game.acnes.push(acne);

            panel.append(acne.beforeElement);
            panel.append(acne.afterElement);
            panel.append(acne.liquidElement);
            panel.append(acne.textElement);
            setTimeout(acne.start, _game.waitingTime);
        }

        return _game.acnes;
    }

    function randomPosition(positions, exists) {
        while (1) {
            var x = _.random(0, positions.length - 1);
            if (exists.indexOf(x) == -1) {
                return x;
            }
        }
    }

    function countdown(seconds) {
        if (seconds == 0) {
            cloud.html("<span class='second'>开始</span>");
            return;
        }
        cloud.find('.second').text(seconds);

        setTimeout(function() {
            countdown(--seconds)
        }, 1000);
    }

    return _game;
}

var Acne = function(game, index, position) {
    var game = game;
    var _this = this;
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    this.index = index;
    this.position = position;
    this.isDied = false;
    this.isStart = false;
    this.start = function() {
        _this.isStart = true;
        _this.textElement.childNodes[0].innerText = '?';
        _this.textElement.childNodes[0].textContent = '?';
        _this.textElement.style.marginTop = '-14px';
        _this.textElement.style.marginLeft = '16px';
        _this.beforeElement.style.display = 'block';
    }

    this.open = function() {
        if (!_this.isStart || _this.isDied) return;
        var res = game.validate(_this);

        if (res) {
            _this.isDied = true;
            _this.liquidElement.style.display = 'block';
            _this.textElement.style.display = 'none';
            _this.beforeElement.style.display = 'none';
            setTimeout(function() {
                _this.liquidElement.style.display = 'none';
                _this.afterElement.style.display = 'block';
                _this.textElement.style.display = 'block';
                _this.textElement.childNodes[0].innerText = _this.index;
                _this.textElement.childNodes[0].textContent = _this.index;
                
                if (res == 2) {
                    game.nextLevel();
                }
            }, 500)
        }

    }

    //number text
    var textElement = document.createElement("div");
    textElement.id = "text-" + this.index;
    textElement.className = "girl-text";
    textElement.style.left = this.position.x;
    textElement.style.top = this.position.y;
    if (textElement.addEventListener) {
        if (isMobile.any()) {
            textElement.addEventListener('touchstart', this.open, false);
        } else {
            textElement.addEventListener('mousedown', this.open, false);
        }
    } else if (textElement.attachEvent) {
        if (isMobile.any()) {
            textElement.attachEvent('touchstart', this.open, false);
        } else {
            textElement.attachEvent('mousedown', this.open, false);
        }
    }
    var span = document.createElement("span");
    span.className = "span" + _.random(1, 4);
    span.textContent = this.index;
    span.innerText = this.index;
    textElement.appendChild(span);

    //acne before click
    var acneBeforeElement = document.createElement("div");
    acneBeforeElement.id = "before-" + this.index;
    acneBeforeElement.className = "girl-acne";
    acneBeforeElement.style.left = this.position.x;
    acneBeforeElement.style.top = this.position.y;

    if (acneBeforeElement.addEventListener) {
        if (isMobile.any()) {
            acneBeforeElement.addEventListener('touchstart', this.open, false);
        } else {
            acneBeforeElement.addEventListener('mousedown', this.open, false);
        }
    } else if (acneBeforeElement.attachEvent) {
        if (isMobile.any()) {
            acneBeforeElement.attachEvent('touchstart', this.open, false);
        } else {
            acneBeforeElement.attachEvent('mousedown', this.open, false);
        }
    }

    var img = document.createElement("img");
    img.src = "images/acne.png";
    acneBeforeElement.appendChild(img);

    //acne after click
    var acneAfterElement = document.createElement("div");
    acneAfterElement.id = "after-" + this.index;
    acneAfterElement.className = "girl-acne";
    acneAfterElement.style.left = this.position.x;
    acneAfterElement.style.top = this.position.y;
    acneAfterElement.style.display = 'none';
    var img = document.createElement("img");
    img.src = "images/deadacne.png";
    acneAfterElement.appendChild(img);

    //liquid
    var liquidElement = document.createElement("div");
    liquidElement.id = "liquid-" + this.index;
    liquidElement.className = "girl-liquid";
    liquidElement.style.left = this.position.x;
    liquidElement.style.top = this.position.y;

    var img = document.createElement("img");
    img.src = "images/liquid.png";
    liquidElement.appendChild(img);

    this.beforeElement = acneBeforeElement;
    this.afterElement = acneAfterElement;
    this.liquidElement = liquidElement;
    this.textElement = textElement;


}
