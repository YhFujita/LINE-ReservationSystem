function doPost(e) {
    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    try {
        var data;
        if (e.postData && e.postData.contents) {
            data = JSON.parse(e.postData.contents);
        } else {
            throw new Error('No data received');
        }

        // --- SECURITY CHECKS ---

        // 1. Honeypot check (Spam prevention)
        // If the hidden field 'honeypot' has a value, it's likely a bot.
        if (data.honeypot) {
            // Return success to confuse the bot, but do NOT save.
            console.warn('Bot detected via honeypot');
            output.setContent(JSON.stringify({ status: 'success', message: 'Received' }));
            return output;
        }

        // 2. Input Validation
        if (!data.menu || !data.datetime || !data.name || !data.phone) {
            throw new Error('必須項目が不足しています');
        }

        if (data.name.length > 50) throw new Error('名前が長すぎます');
        if (data.phone.length > 20) throw new Error('電話番号の形式が正しくありません');
        if (data.notes && data.notes.length > 500) throw new Error('備考欄は500文字以内で入力してください');

        // -----------------------

        // Save to spreadsheet
        var id = SheetUtils.appendReservation(data);

        var result = {
            status: 'success',
            message: '予約を受け付けました',
            reservationId: id
        };
        output.setContent(JSON.stringify(result));

    } catch (error) {
        var errorResult = {
            status: 'error',
            message: 'Error: ' + error.toString()
        };
        output.setContent(JSON.stringify(errorResult));
    }

    return output;
}

function doGet(e) {
    var output = ContentService.createTextOutput(JSON.stringify({ status: 'running', message: 'GAS Backend is active' }));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
}
