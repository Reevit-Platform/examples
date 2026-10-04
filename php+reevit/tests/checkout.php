<?php

require __DIR__ . '/../vendor/autoload.php';

use App\PaymentController;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use GuzzleHttp\Psr7\Response;
use Reevit\Reevit;

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}

$reply = json_encode(['id' => 'pay_example', 'status' => 'requires_action', 'amount' => 5000, 'currency' => 'GHS']);
$transport = new MockHandler([new Response(200, [], $reply), new Response(200, [], $reply)]);
$history = [];
$stack = HandlerStack::create($transport);
$stack->push(Middleware::history($history));
$controller = new PaymentController('pfk_test_example');
// Use the installed SDK's real request builder with a recording transport.
(new ReflectionProperty(PaymentController::class, 'client'))->setValue($controller,
    new Reevit('pfk_test_example', 'org_example', 'http://canary.invalid', 10, $stack));

for ($i = 0; $i < 2; $i++) {
    $result = $controller->create(['amount' => 5000, 'currency' => 'GHS'], 'checkout:order_123');
    check($result['id'] === 'pay_example', 'example did not return the SDK result');
}
check(count($history) === 2, 'expected exactly two transport requests');
foreach ($history as $call) {
    check($call['request']->getUri()->getPath() === '/v1/payments/intents', 'incorrect SDK endpoint');
    check($call['request']->getHeaderLine('Idempotency-Key') === 'checkout:order_123', 'missing or changed key');
}
$first = (string) $history[0]['request']->getBody();
$retry = (string) $history[1]['request']->getBody();
check($first === $retry, 'retry changed the payment payload');
check(json_decode($first, true)['reference'] === 'checkout:order_123', 'unstable generated reference');

try {
    $controller->create(['amount' => 5000], '');
    throw new RuntimeException('missing key was accepted');
} catch (InvalidArgumentException $error) {
    check(count($history) === 2, 'missing key reached the SDK transport');
}
echo "PHP quickstart: Composer autoload, released SDK, and stable checkout requests verified.\n";
