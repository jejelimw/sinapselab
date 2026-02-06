import SwiftUI
import shared

struct ContentView: View {
    let greeting = Greeting().greet()
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("SinapseLab")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(Color(hex: "6366F1"))
                
                Text(greeting)
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .padding()
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Bem-vindo!")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(Color(hex: "6366F1"))
                    
                    Text("Este é o aplicativo mobile KMP do SinapseLab. Configure o endpoint da API Django no NetworkClient para começar a integrar com o backend.")
                        .font(.body)
                        .foregroundColor(.secondary)
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color(.systemBackground))
                        .shadow(color: .gray.opacity(0.2), radius: 4, x: 0, y: 2)
                )
                .padding()
                
                Button(action: {
                    // TODO: Implementar navegação
                }) {
                    Text("Explorar")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "6366F1"))
                        .cornerRadius(10)
                }
                .padding(.horizontal)
            }
            .padding()
            .navigationTitle("")
            .navigationBarHidden(true)
        }
    }
}

// Helper to create Color from hex
extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgbValue: UInt64 = 0
        scanner.scanHexInt64(&rgbValue)
        
        let r = Double((rgbValue & 0xff0000) >> 16) / 255.0
        let g = Double((rgbValue & 0x00ff00) >> 8) / 255.0
        let b = Double(rgbValue & 0x0000ff) / 255.0
        
        self.init(red: r, green: g, blue: b)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
