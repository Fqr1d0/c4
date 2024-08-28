$(document).ready(function() {
// TODO Dessiner le tableau et les trous
const gamepad = new Gamepad('#c4')

gamepad.onPlayerTurn = function() {
$('#player').text(gamepad.player);
}

$('#play').click(function() {
    gamepad.newgame();
})
});