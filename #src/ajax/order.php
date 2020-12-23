<?php
	$log_filename = './post.log';
	$date = date("Y-m-d H:i:s");

	// Достаем данные из запроса
	$post = json_decode(file_get_contents('php://input'), JSON_UNESCAPED_UNICODE);
	$post['Дата'] = $date;

	// Обезопасиваем полученные данные
	array_walk_recursive($post, 'safe_html');
	$message = '';
	array_walk_recursive($post, function($value, $key){
		global $message;
		$message .= html_table_row($key, $value);
	});

	// Отправка e-mail
	$subject = "tsburo.com | Новая заявка с сайта";
	$to_emails = ['mansurmamirov@gmail.com', 'hello@tsburo.com'];

	// Заголовки для HTML-письма
	$headers = [];
	$headers[] = 'MIME-Version: 1.0';
	$headers[] = 'Content-type: text/html; charset=iso-8859-1';

	// Дополнительные заголовки
	// $headers[] = 'To: Mary <mary@example.com>, Kelly <kelly@example.com>';
	// $headers[] = 'From: Birthday Reminder <birthday@example.com>';
	// $headers[] = 'Cc: birthdayarchive@example.com';
	// $headers[] = 'Bcc: birthdaycheck@example.com';

	$header = "<html>
		<head>
			<title>ts	buro.com | Новая заявка с сайта</title>
		</head>
		<body>
			<h2>Новая заявка с сайта tsburo.com</h2>
			<table cellspacing=\"0\" cellpadding=\"0\" style=\"width:310px; border:none;\">";

	$body = $message;

	$footer = "</table>
	</body>
	</html>";

$res = [];
$res['Дата'] = $date;

$to = join(', ', $to_emails);
try {
	$res['ok'] = mail($to, $subject, $header.$body.$footer, implode("\r\n", $headers));
} catch (Exception $e) {
	$res['Ошибки скрипта order.php'][] = $e->getMessage();
};

$res['post'] = $post;

// sleep(1);
// Запись в лог
try {
	file_put_contents($log_filename, json_encode($post, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)."\n\n", FILE_APPEND);
} catch (Exception $e) {
	$res['Ошибки скрипта order.php'][] = $e->getMessage();
}
echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);




function safe_html(&$item, $key) {
	$item = htmlspecialchars($item);
};

function html_table_row(&$item, $key) {
	return "<tr><td style=\"padding: 10px; border: 1px solid #eeeeee;\">$item</td><td style=\"padding: 10px; border: 1px solid #eeeeee;\">$key</td></tr>";
};
?>