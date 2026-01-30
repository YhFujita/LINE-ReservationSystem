function doGet(e) {
    return HtmlService.createTemplateFromFile('src/index')
        .evaluate()
        .setTitle('予約フォーム')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

function saveReservation(data) {
    try {
        // SheetUtils must be available in the global scope (GAS default behavior for properly ordered files)
        var id = SheetUtils.appendReservation(data);
        return { status: 'success', message: '予約を受け付けました', reservationId: id };
    } catch (e) {
        console.error(e);
        return { status: 'error', message: '予約の保存に失敗しました: ' + e.toString() };
    }
}
