;; MINIMAL Anti-Scalper Contract - No tuple/print issues
(define-data-var total-supply uint u0)
(define-data-var next-token-id uint u1)

(define-constant FACE-VALUE u100)
(define-constant BURN-FEE u10)

(define-map token-owner uint principal)
(define-map token-approved uint principal)
(define-map token-price uint uint)
(define-map token-uri uint (buff 256))

(define-constant ERR-NOT-AUTHORIZED u101)
(define-constant ERR-NOT-OWNER u102)
(define-constant ERR-NOT-FOUND u103)
(define-constant ERR-PRICE-EXCEEDED u104)
(define-constant ERR-INSUFFICIENT-BALANCE u107)

;; Mint new ticket
(define-public (mint-ticket (to principal) (uri (buff 256)))
  (let ((new-id (var-get next-token-id)))
    (map-set token-owner new-id to)
    (map-set token-price new-id FACE-VALUE)
    (map-set token-uri new-id uri) ;; Store the URI for this token
    (var-set next-token-id (+ new-id u1))
    (var-set total-supply (+ (var-get total-supply) u1))
    (ok new-id)
  )
)

;; Free transfer (gifts)
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (let ((owner (unwrap! (map-get? token-owner token-id) (err ERR-NOT-FOUND))))
    (asserts! (is-eq tx-sender owner) (err ERR-NOT-AUTHORIZED))
    (map-set token-owner token-id recipient)
    (map-delete token-approved token-id)
    (ok true)
  )
)

;; Sale with price enforcement
(define-public (safe-transfer-with-price (token-id uint) (sender principal) (recipient principal) (sale-price uint))
  (let ((owner (unwrap! (map-get? token-owner token-id) (err ERR-NOT-FOUND))))
    (asserts! (is-eq tx-sender owner) (err ERR-NOT-AUTHORIZED))
    (asserts! (<= sale-price FACE-VALUE) (err ERR-PRICE-EXCEEDED))
    (asserts! (>= (stx-get-balance tx-sender) BURN-FEE) (err ERR-INSUFFICIENT-BALANCE))
    (try! (stx-burn? BURN-FEE tx-sender))
    (map-set token-owner token-id recipient)
    (map-delete token-approved token-id)
    (ok true)
  )
)

;; Approve
(define-public (approve (to principal) (token-id uint))
  (let ((owner (unwrap! (map-get? token-owner token-id) (err ERR-NOT-FOUND))))
    (asserts! (is-eq tx-sender owner) (err ERR-NOT-AUTHORIZED))
    (map-set token-approved token-id to)
    (ok true)
  )
)

;; Simplified approval for all
(define-public (set-approval-for-all (operator principal) (approved bool))
  (ok true)
)

;; Burn ticket
(define-public (burn (token-id uint))
  (let ((owner (unwrap! (map-get? token-owner token-id) (err ERR-NOT-FOUND))))
    (asserts! (is-eq tx-sender owner) (err ERR-NOT-AUTHORIZED))
    (map-delete token-owner token-id)
    (map-delete token-approved token-id)
    (map-delete token-price token-id)
    (var-set total-supply (- (var-get total-supply) u1))
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-last-token-id)
  (- (var-get next-token-id) u1)
)

(define-read-only (get-token-uri (token-id uint))
  (match (map-get? token-uri token-id)
    uri (ok (some uri))
    (ok none)
  )
)

(define-read-only (get-owner (token-id uint))
  (ok (map-get? token-owner token-id))
)

(define-read-only (get-total-supply)
  (ok (var-get total-supply))
)

(define-read-only (get-token-price (token-id uint))
  (map-get? token-price token-id)
)

(define-read-only (get-approved (token-id uint))
  (ok (map-get? token-approved token-id))
)

(define-read-only (can-sell-at-price? (token-id uint) (sale-price uint))
  (and
    (is-some (map-get? token-owner token-id))
    (<= sale-price FACE-VALUE)
  )
)

(define-read-only (is-approved-for-all (owner principal) (operator principal))
  false
)