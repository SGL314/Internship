import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Dados de exemplo (dois vetores)
x = np.array([1, 2, 3, 4, 5])
y = np.array([1.1, 2.0, 2.9, 4.1, 5.1])

# Redimensionar x para formato (n_amostras, 1)
x_reshape = x.reshape(-1, 1)

# Criar e treinar o modelo de regressão
modelo = LinearRegression()
modelo.fit(x_reshape, y)

# Previsão para os mesmos x
y_pred = modelo.predict(x_reshape)

# Visualização
plt.scatter(x, y, color='blue', label='Pontos')
plt.plot(x, y_pred, color='red', label='Regressão linear')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Regressão Linear')
plt.legend()
plt.grid(True)
plt.show()
