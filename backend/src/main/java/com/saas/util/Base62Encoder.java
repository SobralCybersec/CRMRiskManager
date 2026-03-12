package com.saas.util;

import org.springframework.stereotype.Component;

@Component
public class Base62Encoder {
    private static final String BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int BASE = 62;

    public String encode(Long id) {
        if (id == null || id == 0) return "0";
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(BASE62.charAt((int) (id % BASE)));
            id /= BASE;
        }
        return sb.reverse().toString();
    }

    public Long decode(String encoded) {
        if (encoded == null || encoded.isEmpty()) return 0L;
        long result = 0;
        for (char c : encoded.toCharArray()) {
            result = result * BASE + BASE62.indexOf(c);
        }
        return result;
    }
}
