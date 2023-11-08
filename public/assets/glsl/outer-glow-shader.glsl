precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform vec3 u_glowColor;
uniform float u_glowStrength;

void main() {
    vec4 color = vec4(0.0);
    vec2 texCoord = gl_FragCoord.xy / uResolution.xy;

    // Apply a blur effect to the input image
    for (float i = -4.0; i <= 4.0; i += 1.0) {
        for (float j = -4.0; j <= 4.0; j += 1.0) {
            vec2 offset = vec2(i, j) / uResolution.xy;
            color += texture2D(uMainSampler, texCoord + offset) / 81.0;
        }
    }

    // Combine the blurred image with a solid color to create the outer glow effect
    vec3 glow = mix(color.rgb, u_glowColor, u_glowStrength);
    gl_FragColor = vec4(glow, color.a);
}
