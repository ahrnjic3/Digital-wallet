import React from "react"
import { View } from "react-native"
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Image as SvgImage,
  ClipPath,
  Circle
} from "react-native-svg"
import qrcodegen from "@ribpay/qr-code-generator"

const QRCode = ({
  value,
  errorCorrection = "MEDIUM",
  size = 200,
  backgroundColor = "#FFFFFF",
  foregroundColor = "#000000",
  quietZone = 2,
  logo,
  logoSize = 50,
  logoMargin = 2,
  gradient,
  ...props
}) => {
  const QRC = qrcodegen.QrCode
  const qr =
    typeof value === "string"
      ? QRC.encodeText(value, QRC.Ecc[errorCorrection])
      : QRC.encodeBinary(value, QRC.Ecc[errorCorrection])

  const moduleCount = qr.size
  const cellSize = size / (moduleCount + 2 * quietZone)

  const getPathData = () => {
    let path = ""
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.getModule(col, row)) {
          const x = (quietZone + col) * cellSize
          const y = (quietZone + row) * cellSize
          path += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z `
        }
      }
    }
    return path
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Defs>
          {gradient && (
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradient.start} />
              <Stop offset="100%" stopColor={gradient.end} />
            </LinearGradient>
          )}
          {logo && (
            <ClipPath id="clipCircle">
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={logoSize / 2 + logoMargin}
              />
            </ClipPath>
          )}
        </Defs>
        <Rect width="100%" height="100%" fill={backgroundColor} />
        <Path
          d={getPathData()}
          fill={gradient ? "url(#grad)" : foregroundColor}
        />
        {logo && (
          <SvgImage
            x={(size - logoSize) / 2}
            y={(size - logoSize) / 2}
            width={logoSize}
            height={logoSize}
            href={logo}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clipCircle)"
          />
        )}
      </Svg>
    </View>
  )
}

export default QRCode
