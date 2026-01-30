var SheetUtils = (function () {
    var SPREADSHEET_ID = ''; // ユーザーに設定してもらうか、プロパティスクリプトで管理
    var SHEET_NAME = '予約一覧';

    function getSheet() {
        var ss = SPREADSHEET_ID
            ? SpreadsheetApp.openById(SPREADSHEET_ID)
            : SpreadsheetApp.getActiveSpreadsheet();
        var sheet = ss.getSheetByName(SHEET_NAME);
        if (!sheet) {
            sheet = ss.insertSheet(SHEET_NAME);
            // ヘッダー行を追加
            sheet.appendRow(['日時', '予約ID', '予約者名', 'メニュー', '希望日時', '電話番号', '備考', 'ステータス']);
        }
        return sheet;
    }

    return {
        appendReservation: function (data) {
            var sheet = getSheet();
            var id = Utilities.getUuid();
            var timestamp = new Date();

            sheet.appendRow([
                timestamp,
                id,
                data.name,
                data.menu,
                data.datetime,
                data.phone,
                data.notes,
                '受付'
            ]);
            return id;
        }
    };
})();
