class Gamepad {
    constructor(selector) {
        this.ROWS = 6;
        this.COL = 7;
        this.player = 'pink'
        this.selector = selector;
        this.isGameOver = false;
        this.onPlayerTurn = function () { };
        this.createPad();
        this.clicControllers();
    }

    //*tableau de jeu
    createPad() {
        const $pad = $(this.selector);
        $pad.empty();
        this.isGameOver = false;
        this.player = 'pink' || 'green';
        for (let row = 0; row < this.ROWS; row++) {
            const $row = $('<div>')
                .addClass('row');
            for (let col = 0; col < this.COL; col++) {
                const $col = $('<div>')
                    .addClass('column empty')
                    .attr('data-col', col)
                    .attr('data-row', row);
                $row.append($col);
            }
            $pad.append($row);
        }
    }

    //Tours de jeux au clic
    clicControllers() {
        const $pad = $(this.selector);
        const that = this;

        //Identifier dernière case vide
        function findLastEmptyCell(col) {
            const cells = $(`.column[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                const $cell = $(cells[i]);

                if ($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }

        $pad.on('mouseenter', '.column.empty', function () {
            const col = $(this).data('col');
            const $bottomEmptyCell = findLastEmptyCell(col);
            $bottomEmptyCell.addClass(`next-${that.player}`);
        });

        $pad.on('mouseleave', '.column', function () {
            $('.column').removeClass(`next-${that.player}`);
        });

        $pad.on('click', '.column.empty', function () {
            if (that.isGameOver) return;
            const col = $(this).data('col');
            const $bottomEmptyCell = findLastEmptyCell(col);

            $bottomEmptyCell.removeClass(`empty next-${that.player}`);
            $bottomEmptyCell.addClass(that.player);
            $bottomEmptyCell.data('player', that.player);

            const winner = that.checkForWinner(
                $bottomEmptyCell.data('row'),
                $bottomEmptyCell.data('col')
            )
            if (winner) {
                that.isGameOver = true;
                //celebrate victory
                alert(`Game Over! Player ${that.player} has won!`);
                $('.column.empty').removeClass('empty');
                return;
            }

            that.player = (that.player === 'pink') ? 'green' : 'pink';
            that.onPlayerTurn();
            $(this).trigger('mouseenter');
        });
    }

    checkForWinner(row, col) {
        const that = this;

        function $getCell(i, j) {
            return $(`.column[data-row='${i}'][data-col='${j}']`);
        }

        function checkDirection(direct) {
            let total = 0;
            let i = row + direct.i;
            let j = col + direct.j;
            let $next = $getCell(i, j);
            while (i >= 0 &&
                j >= 0 &&
                j < that.COL &&
                $next.data('player') === that.player
            ) {
                total++;
                i += direct.i;
                j += direct.j;
                $next = $getCell(i, j);
            }
            return total;
        }

        function checkWin(directA, directB) {
            const total = 1 +
                checkDirection(directA) +
                checkDirection(directB);
            if (total >= 4) {
                return that.player;
            } else {
                return null;
            }
        }


        function checkDiagonalBLtoTR() {
            return checkWin({ i: 1, j: -1 }, { i: 1, j: 1 })
        }

        function checkDiagonalTLtoBR() {
            return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 })
        }

        function checkVerticals() {
            return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
        }

        function checkHorizontals() {
            return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
        }

        return checkVerticals() || checkHorizontals() || checkDiagonalBLtoTR() || checkDiagonalTLtoBR()
    }

    newgame() {
        this.createPad();
        this.onPlayerTurn();
    }



}

